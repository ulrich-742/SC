"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../database/client"));
class AppointmentRepository {
    // The C of CRUD - Create operation
    async readAll(filters) {
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
        const queryParams = [];
        if (filters?.startDate && filters?.endDate) {
            query += " WHERE a.appointment_date BETWEEN ? AND ?";
            queryParams.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
        }
        const [rows] = await client_1.default.query(query, queryParams);
        // Return the array of Appointments
        return rows;
    }
    async readAllForAdmin(filters) {
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
        const queryParams = [];
        if (filters?.startDate && filters?.endDate) {
            query += " WHERE a.appointment_date BETWEEN ? AND ?";
            queryParams.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
        }
        const [rows] = await client_1.default.query(query, queryParams);
        // Return the array of Appointments
        return rows;
    }
    async readByBarber(barberId, status) {
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
        const params = [barberId];
        if (status) {
            query += " AND a.status = ?";
            params.push(status);
        }
        query += " ORDER BY a.appointment_date DESC";
        const [rows] = await client_1.default.query(query, params);
        return rows;
    }
    async updateStatus(id, status) {
        await client_1.default.query("UPDATE appointment SET status = ? WHERE id_appointment = ?", [status, id]);
        return true;
    }
    async readwithuserid(id) {
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
        const [rows] = await client_1.default.query(query, [id]);
        return rows;
    }
    async create(appointment) {
        const connection = await client_1.default.getConnection();
        try {
            await connection.beginTransaction();
            const [serviceRows] = await connection.query("SELECT 1 FROM propose WHERE id_user = ? AND id_prestation = ? LIMIT 1", [appointment.id_user_barber, appointment.id_prestation]);
            if (serviceRows.length === 0) {
                throw Object.assign(new Error("Prestation non proposée par ce coiffeur"), { status: 400 });
            }
            const [slots] = await connection.query(`SELECT id_availability FROM barber_availability
         WHERE id_user = ? AND start_time = ? AND is_booked = FALSE
         FOR UPDATE`, [appointment.id_user_barber, appointment.appointment_date]);
            if (slots.length === 0) {
                throw Object.assign(new Error("Ce créneau n'est plus disponible"), { status: 409 });
            }
            const [result] = await connection.query(`INSERT INTO appointment
         (appointment_date, location_type, id_prestation, id_user_barber, id_user_customer)
         VALUES (?, ?, ?, ?, ?)`, [appointment.appointment_date, appointment.location_type, appointment.id_prestation, appointment.id_user_barber, appointment.id_user_customer]);
            await connection.query("UPDATE barber_availability SET is_booked = TRUE WHERE id_availability = ?", [slots[0].id_availability]);
            await connection.commit();
            return result;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async readById(id) {
        const [rows] = await client_1.default.query("SELECT * FROM appointment WHERE id_appointment = ?", [id]);
        return rows[0] ?? null;
    }
}
exports.default = new AppointmentRepository();
//# sourceMappingURL=appointmentRepository.js.map