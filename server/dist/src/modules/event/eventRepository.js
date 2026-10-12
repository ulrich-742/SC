"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../database/client"));
class eventRepository {
    // The C of CRUD - Create operation
    async create(event) {
        const [result] = await client_1.default.query(`INSERT INTO event (title, image_url, description, status, start_date, end_date, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            event.title,
            event.image_url,
            event.description,
            event.status,
            event.start_date,
            event.end_date,
            event.location,
        ]);
        return result.insertId;
    }
    async readAll() {
        // Execute the SQL SELECT query to retrieve all Events from the "Event" table
        const [rows] = await client_1.default.query(`SELECT id_event, title, image_url, description, status, location,
            DATE_FORMAT(start_date, '%Y-%m-%dT%H:%i:%s') AS start_date,
            DATE_FORMAT(end_date, '%Y-%m-%dT%H:%i:%s') AS end_date 
     FROM event`);
        // Return the array of Events
        return rows;
    }
    // The U of CRUD - Update operation
    // TODO: Implement the update operation to modify an existing Event
    async update(id, event) {
        const [rows] = await client_1.default.query("SELECT image_url FROM event WHERE id_event = ?", [id]);
        const existingEvents = rows;
        const currentEvent = existingEvents[0];
        if (!currentEvent) {
            return 0;
        }
        const finalImageUrl = event.image_url !== undefined ? event.image_url : currentEvent.image_url;
        const [result] = await client_1.default.query(`UPDATE event 
       SET title = ?, image_url = ?, description = ?, status = ?, start_date = ?, end_date = ?, location = ? 
       WHERE id_event = ?`, [
            event.title,
            finalImageUrl,
            event.description,
            event.status,
            event.start_date,
            event.end_date,
            event.location,
            id,
        ]);
        return result.affectedRows;
    }
    // async update(Event: Event) {
    //   ...
    // }
    // The D of CRUD - Delete operation
    // TODO: Implement the delete operation to remove an Event by its ID
    // async delete(id: number) {
    //   ...
    // }
    async delete(id) {
        const [result] = await client_1.default.query("DELETE FROM event WHERE id_event = ?", [id]);
        // Retourne le nombre de lignes supprimées (devrait être 1)
        return result.affectedRows;
    }
}
exports.default = new eventRepository();
//# sourceMappingURL=eventRepository.js.map