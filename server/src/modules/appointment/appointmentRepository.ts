import type { Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

export type Appointment = {
  id_appointment: number;
  appointment_date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  location_type: string;
  create_time: Date;
  id_prestation: number;
  id_user_barber: number;
  id_user_customer: number;
};

export type AppointmentWithDetails = Appointment & {
  barber_name: string;
  barber_avatar: string;
  barber_phone?: string;
  barber_postal_code?: string;
  barber_city?: string;
  barber_adress?: string;
  barber_email?: string;

  customer_firstname: string;
  customer_lastname: string;
  customer_avatar?: string;
  customer_phone?: string;
  customer_postal_code?: string;
  customer_city?: string;
  customer_adress?: string;
  customer_email?: string;

  prestation_name: string;
  duration_minutes?: number;
  price?: number;
};
export type NewAppointment = Omit<
  Appointment,
  "id_appointment" | "create_time" | "status"
>;

class AppointmentRepository {
  // The C of CRUD - Create operation

  async readAll(filters?: { startDate?: string; endDate?: string }) {
    // Execute the SQL SELECT query to retrieve all Appointments from the "Appointment" table
    let query = `
      SELECT 
        a.*,
        b.name AS barber_name,
        ub.avatar_url AS barber_avatar, 
        c.firstname AS customer_firstname,
        c.lastname AS customer_lastname,
        u.avatar_url AS customer_avatar, 
        p.name AS prestation_name,
        p.duration_minutes AS duration_minutes,
        u.phone AS customer_phone,
        c.city AS customer_city,
        c.adress As customer_adress
      FROM appointment a
      JOIN barber b ON a.id_user_barber = b.id_user
      JOIN customer c ON a.id_user_customer = c.id_user
      JOIN users u ON c.id_user = u.id_user  
      JOIN users ub ON b.id_user = ub.id_user  
      JOIN prestation p ON a.id_prestation = p.id_prestation
      `;
    const queryParams: string[] = [];

    if (filters?.startDate && filters?.endDate) {
      query += " WHERE a.appointment_date BETWEEN ? AND ?";
      queryParams.push(
        `${filters.startDate} 00:00:00`,
        `${filters.endDate} 23:59:59`,
      );
    }

    const [rows] = await databaseClient.query<Rows>(query, queryParams);

    // Return the array of Appointments
    return rows as AppointmentWithDetails[];
  }
  async readAllForAdmin(filters?: { startDate?: string; endDate?: string }) {
    // Execute the SQL SELECT query to retrieve all Appointments from the "Appointment" table
    let query = `
      SELECT 
        a.*,
        b.name AS barber_name,
        b.postal_code AS barber_postal_code,
        b.city AS barber_city,
        b.adress AS barber_adress,
        c.firstname AS customer_firstname,
        c.lastname AS customer_lastname,
        c.postal_code AS customer_postal_code,
        c.city AS customer_city,
        c.adress As customer_adress,
        u.avatar_url AS customer_avatar, 
        u.phone AS customer_phone,
        u.email AS customer_email,
        ub.avatar_url AS barber_avatar, 
        ub.phone AS barber_phone, 
        ub.email AS barber_email, 
        p.name AS prestation_name,
        p.duration_minutes AS duration_minutes,
        p.price AS price
      FROM appointment a
      JOIN barber b ON a.id_user_barber = b.id_user
      JOIN customer c ON a.id_user_customer = c.id_user
      JOIN users u ON c.id_user = u.id_user  
      JOIN users ub ON b.id_user = ub.id_user  
      JOIN prestation p ON a.id_prestation = p.id_prestation
      `;
    const queryParams: string[] = [];

    if (filters?.startDate && filters?.endDate) {
      query += " WHERE a.appointment_date BETWEEN ? AND ?";
      queryParams.push(
        `${filters.startDate} 00:00:00`,
        `${filters.endDate} 23:59:59`,
      );
    }

    const [rows] = await databaseClient.query<Rows>(query, queryParams);

    // Return the array of Appointments
    return rows as AppointmentWithDetails[];
  }
  async readByBarber(barberId: number, status?: string) {
    let query = `
      SELECT
        a.*,
        c.firstname AS customer_firstname,
        c.lastname AS customer_lastname,
        u.avatar_url AS customer_avatar,
        p.name AS prestation_name,
        p.price AS prestation_price,
        p.duration_minutes AS duration_minutes
      FROM appointment a
      JOIN customer c ON a.id_user_customer = c.id_user
      JOIN users u ON c.id_user = u.id_user
      JOIN prestation p ON a.id_prestation = p.id_prestation
      WHERE a.id_user_barber = ?
    `;
    const params: (string | number)[] = [barberId];
    if (status) {
      query += " AND a.status = ?";
      params.push(status);
    }
    query += " ORDER BY a.appointment_date DESC";
    const [rows] = await databaseClient.query<Rows>(query, params);
    return rows as AppointmentWithDetails[];
  }

  async updateStatus(id: number, status: string) {
    await databaseClient.query(
      "UPDATE appointment SET status = ? WHERE id_appointment = ?",
      [status, id],
    );
    return true;
  }

  async readwithuserid(id: number) {
    const query = `
      SELECT 
        a.*,
        b.name AS barber_name,
        c.firstname AS customer_firstname,
        c.lastname AS customer_lastname,
        u.avatar_url AS barber_avatar, 
        p.name AS prestation_name
      FROM appointment a
      JOIN barber b ON a.id_user_barber = b.id_user
      JOIN customer c ON a.id_user_customer = c.id_user
      JOIN users u ON b.id_user = u.id_user  
      JOIN prestation p ON a.id_prestation = p.id_prestation
      WHERE a.id_user_customer = ? 
      `;
    const [rows] = await databaseClient.query<Rows>(query, [id]);

    return rows as AppointmentWithDetails[];
  }

  async create(
    appointment: Omit<Appointment, "id_appointment" | "create_time" | "status">,
  ) {
    const connection = await databaseClient.getConnection();
    try {
      await connection.beginTransaction();
      const [serviceRows] = await connection.query<Rows>(
        "SELECT 1 FROM propose WHERE id_user = ? AND id_prestation = ? LIMIT 1",
        [appointment.id_user_barber, appointment.id_prestation],
      );
      if (serviceRows.length === 0) {
        throw Object.assign(new Error("Prestation non proposée par ce coiffeur"), { status: 400 });
      }
      const [slots] = await connection.query<Rows>(
        `SELECT id_availability FROM barber_availability
         WHERE id_user = ? AND start_time = ? AND is_booked = FALSE
         FOR UPDATE`,
        [appointment.id_user_barber, appointment.appointment_date],
      );
      if (slots.length === 0) {
        throw Object.assign(new Error("Ce créneau n'est plus disponible"), { status: 409 });
      }
      const [result] = await connection.query(
        `INSERT INTO appointment
         (appointment_date, location_type, id_prestation, id_user_barber, id_user_customer)
         VALUES (?, ?, ?, ?, ?)`,
        [appointment.appointment_date, appointment.location_type, appointment.id_prestation, appointment.id_user_barber, appointment.id_user_customer],
      );
      await connection.query(
        "UPDATE barber_availability SET is_booked = TRUE WHERE id_availability = ?",
        [slots[0].id_availability],
      );
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async readById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM appointment WHERE id_appointment = ?",
      [id],
    );
    return (rows as Appointment[])[0] ?? null;
  }
  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing Appointment

  // async update(Appointment: Appointment) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an Appointment by its ID

  // async delete(id: number) {
  //   ...
  // }
}

export default new AppointmentRepository();
