"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../database/client"));
class PrestationRepository {
    // The C of CRUD - Create operation
    async readAll() {
        // Execute the SQL SELECT query to retrieve all Prestations from the "Prestation" table
        const [rows] = await client_1.default.query("select * from prestation");
        // Return the array of Prestations
        return rows;
    }
    async readByBarber(barberId) {
        const [rows] = await client_1.default.query(`SELECT 
      p.id_prestation,
      p.name,
      p.price,
      p.duration_minutes
      FROM prestation p  INNER JOIN propose pr ON pr.id_prestation = p.id_prestation
      WHERE pr.id_user = ?`, [barberId]);
        return rows;
    }
    async create(prestation) {
        const [result] = await client_1.default.query("INSERT INTO prestation (name, price, duration_minutes) VALUES (?, ?, ?)", [prestation.name, prestation.price, prestation.duration_minutes]);
        await client_1.default.query("INSERT INTO propose (id_user, id_prestation) VALUES (?, ?)", [prestation.id_user, result.insertId]);
        return result.insertId;
    }
    async update(id, prestation) {
        await client_1.default.query(`UPDATE prestation p
     INNER JOIN propose pr
       ON pr.id_prestation = p.id_prestation
     SET
       p.name = ?,
       p.price = ?,
       p.duration_minutes = ?
     WHERE p.id_prestation = ?
       AND pr.id_user = ?`, [
            prestation.name,
            prestation.price,
            prestation.duration_minutes,
            id,
            prestation.id_user,
        ]);
    }
    async delete(id, idUser) {
        await client_1.default.query(`DELETE FROM propose
     WHERE id_prestation = ?
     AND id_user = ?`, [id, idUser]);
        await client_1.default.query(`DELETE FROM prestation
     WHERE id_prestation = ?
     AND NOT EXISTS (
       SELECT 1
       FROM propose
       WHERE id_prestation = ?
     )`, [id, id]);
    }
}
exports.default = new PrestationRepository();
//# sourceMappingURL=prestationRepository.js.map