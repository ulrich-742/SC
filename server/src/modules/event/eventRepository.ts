import type { Result, Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

type Event = {
  id_event: number;
  title: string;
  image_url: string;
  description: string;
  status: "brouillon" | "publié" | "annulé" | "terminé";
  start_date: string;
  end_date: string;
  location: string;
};
type OmitIdEvent = Omit<Event, "id_event">;

class eventRepository {
  // The C of CRUD - Create operation
  async create(event: OmitIdEvent) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO event (title, image_url, description, status, start_date, end_date, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.title,
        event.image_url,
        event.description,
        event.status,
        event.start_date,
        event.end_date,
        event.location,
      ],
    );

    return result.insertId;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all Events from the "Event" table
    const [rows] =
      await databaseClient.query<Rows>(`SELECT id_event, title, image_url, description, status, location,
            DATE_FORMAT(start_date, '%Y-%m-%dT%H:%i:%s') AS start_date,
            DATE_FORMAT(end_date, '%Y-%m-%dT%H:%i:%s') AS end_date 
     FROM event`);

    // Return the array of Events
    return rows as Event[];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing Event
  async update(id: number, event: Partial<OmitIdEvent>) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT image_url FROM event WHERE id_event = ?",
      [id],
    );
    const existingEvents = rows as Event[];
    const currentEvent = existingEvents[0];

    if (!currentEvent) {
      return 0;
    }
    const finalImageUrl =
      event.image_url !== undefined ? event.image_url : currentEvent.image_url;

    const [result] = await databaseClient.query<Result>(
      `UPDATE event 
       SET title = ?, image_url = ?, description = ?, status = ?, start_date = ?, end_date = ?, location = ? 
       WHERE id_event = ?`,
      [
        event.title,
        finalImageUrl,
        event.description,
        event.status,
        event.start_date,
        event.end_date,
        event.location,
        id,
      ],
    );

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
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM event WHERE id_event = ?",
      [id],
    );

    // Retourne le nombre de lignes supprimées (devrait être 1)
    return result.affectedRows;
  }
}

export default new eventRepository();
