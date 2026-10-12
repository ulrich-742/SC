import type { Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

class BarberStatisticsRepository {
  async readStats(barberId: number) {
    // Reservations this week vs last week
    const [reservationsRows] = await databaseClient.query<Rows>(
      `SELECT
        SUM(CASE WHEN appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END) AS current_week,
        SUM(CASE WHEN appointment_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 13 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS last_week
      FROM appointment
      WHERE id_user_barber = ?`,
      [barberId],
    );

    // New customers this week vs last week
    const [customersRows] = await databaseClient.query<Rows>(
      `SELECT
        COUNT(DISTINCT CASE WHEN appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN id_user_customer END) AS current_week,
        COUNT(DISTINCT CASE WHEN appointment_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 13 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN id_user_customer END) AS last_week
      FROM appointment
      WHERE id_user_barber = ?`,
      [barberId],
    );

    // Revenue per day (last 7 days)
    const [revenueRows] = await databaseClient.query<Rows>(
      `SELECT
        DATE(a.appointment_date) AS day,
        SUM(p.price) AS revenue
      FROM appointment a
      JOIN prestation p ON a.id_prestation = p.id_prestation
      WHERE a.id_user_barber = ?
        AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND a.status != 'cancelled'
      GROUP BY DATE(a.appointment_date)
      ORDER BY day ASC`,
      [barberId],
    );

    // Service distribution
    const [serviceRows] = await databaseClient.query<Rows>(
      `SELECT
        p.name,
        COUNT(*) AS count,
        SUM(p.price) AS revenue
      FROM appointment a
      JOIN prestation p ON a.id_prestation = p.id_prestation
      WHERE a.id_user_barber = ?
        AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND a.status != 'cancelled'
      GROUP BY p.id_prestation, p.name
      ORDER BY revenue DESC`,
      [barberId],
    );

    // Status distribution
    const [statusRows] = await databaseClient.query<Rows>(
      `SELECT
        a.status,
        COUNT(*) AS count
      FROM appointment a
      WHERE a.id_user_barber = ?
        AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY a.status`,
      [barberId],
    );

    return {
      reservations: (
        reservationsRows as { current_week: number; last_week: number }[]
      )[0],
      customers: (
        customersRows as { current_week: number; last_week: number }[]
      )[0],
      revenueByDay: revenueRows as { day: string; revenue: number }[],
      serviceDistribution: serviceRows as {
        name: string;
        count: number;
        revenue: number;
      }[],
      statusDistribution: statusRows as { status: string; count: number }[],
    };
  }
}

export default new BarberStatisticsRepository();
