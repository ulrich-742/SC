"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../database/client"));
class ReviewRepository {
    async create(data) {
        const [result] = await client_1.default.query(`INSERT INTO review (rating, comment, id_appointment)
       SELECT ?, ?, a.id_appointment
       FROM appointment a
       WHERE a.id_appointment = ?
         AND a.id_user_customer = ?
         AND a.status = 'completed'
         AND NOT EXISTS (SELECT 1 FROM review r WHERE r.id_appointment = a.id_appointment)`, [data.rating, data.comment, data.id_appointment, data.id_user_customer]);
        if (result.affectedRows === 0) {
            throw Object.assign(new Error("Avis interdit, rendez-vous non terminé ou déjà évalué"), { status: 403 });
        }
        return result;
    }
    async readAll(filters) {
        const queryParams = [];
        let query = "SELECT * FROM review";
        if (filters?.startDate && filters?.endDate) {
            query += " WHERE created_at BETWEEN ? AND ?";
            queryParams.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
        }
        const [rows] = await client_1.default.query(query, queryParams);
        // Return the array of reviews
        return rows;
    }
    async readAllForAdmin(filters) {
        const queryParams = [];
        let query = `
    SELECT r.* ,
    a.appointment_date AS appointment_date,
    a.status AS appointment_status,
    a.location_type AS appointment_location_type,
    b.name AS barber_name,
    c.firstname AS customer_firstname,
    c.lastname AS customer_lastname,
    p.name AS prestation_name,
    p.price AS prestation_price,
    ub.phone AS barber_phone,
    ub.email AS barber_email,
    ub.avatar_url  AS barber_avatar_url,
    uc.phone AS customer_phone,
    uc.email AS customer_email,
    uc.avatar_url  AS customer_avatar_url
    FROM review r
    JOIN appointment a ON r.id_appointment = a.id_appointment
    JOIN prestation p ON a.id_prestation = p.id_prestation
    JOIN barber b ON a.id_user_barber = b.id_user
    JOIN customer c ON a.id_user_customer = c.id_user
    JOIN users ub ON a.id_user_barber = ub.id_user
    JOIN users uc ON a.id_user_customer = uc.id_user
     `;
        if (filters?.startDate && filters?.endDate) {
            query += " WHERE r.created_at BETWEEN ? AND ?";
            queryParams.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
        }
        const [rows] = await client_1.default.query(query, queryParams);
        // Return the array of reviews
        return rows;
    }
    async readByBarber(barberId) {
        const [rows] = await client_1.default.query(`SELECT r.*,
        c.firstname AS customer_firstname,
        c.lastname AS customer_lastname,
        u.avatar_url AS customer_avatar,
        p.name AS prestation_name
       FROM review r
       JOIN appointment a ON r.id_appointment = a.id_appointment
       JOIN customer c ON a.id_user_customer = c.id_user
       JOIN users u ON c.id_user = u.id_user
       JOIN prestation p ON a.id_prestation = p.id_prestation
       WHERE a.id_user_barber = ?
       ORDER BY r.created_at DESC`, [barberId]);
        return rows;
    }
    async delete(id) {
        await client_1.default.query("DELETE FROM review WHERE id_review = ?", [id]);
    }
}
exports.default = new ReviewRepository();
//# sourceMappingURL=reviewRepository.js.map