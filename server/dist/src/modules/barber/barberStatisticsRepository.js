"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../database/client"));
class BarberStatisticsRepository {
    async readStats(barberId) {
        // Reservations this week vs last week
        const [reservationsRows] = await client_1.default.query(`SELECT
        SUM(CASE WHEN appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END) AS current_week,
        SUM(CASE WHEN appointment_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 13 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS last_week
      FROM appointment
      WHERE id_user_barber = ?`, [barberId]);
        // New customers this week vs last week
        const [customersRows] = await client_1.default.query(`SELECT
        COUNT(DISTINCT CASE WHEN appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN id_user_customer END) AS current_week,
        COUNT(DISTINCT CASE WHEN appointment_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 13 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN id_user_customer END) AS last_week
      FROM appointment
      WHERE id_user_barber = ?`, [barberId]);
        // Revenue per day (last 7 days)
        const [revenueRows] = await client_1.default.query(`SELECT
        DATE(a.appointment_date) AS day,
        SUM(p.price) AS revenue
      FROM appointment a
      JOIN prestation p ON a.id_prestation = p.id_prestation
      WHERE a.id_user_barber = ?
        AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND a.status != 'cancelled'
      GROUP BY DATE(a.appointment_date)
      ORDER BY day ASC`, [barberId]);
        // Service distribution
        const [serviceRows] = await client_1.default.query(`SELECT
        p.name,
        COUNT(*) AS count,
        SUM(p.price) AS revenue
      FROM appointment a
      JOIN prestation p ON a.id_prestation = p.id_prestation
      WHERE a.id_user_barber = ?
        AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND a.status != 'cancelled'
      GROUP BY p.id_prestation, p.name
      ORDER BY revenue DESC`, [barberId]);
        // Status distribution
        const [statusRows] = await client_1.default.query(`SELECT
        a.status,
        COUNT(*) AS count
      FROM appointment a
      WHERE a.id_user_barber = ?
        AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY a.status`, [barberId]);
        return {
            reservations: reservationsRows[0],
            customers: customersRows[0],
            revenueByDay: revenueRows,
            serviceDistribution: serviceRows,
            statusDistribution: statusRows,
        };
    }
}
exports.default = new BarberStatisticsRepository();
//# sourceMappingURL=barberStatisticsRepository.js.map