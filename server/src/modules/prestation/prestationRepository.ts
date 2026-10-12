import type { Result, Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

type Prestation = {
  id_prestation: number;
  name: string;
  price: number;
  duration_minutes: number;
};

class PrestationRepository {
  // The C of CRUD - Create operation

  async readAll() {
    // Execute the SQL SELECT query to retrieve all Prestations from the "Prestation" table
    const [rows] = await databaseClient.query<Rows>("select * from prestation");

    // Return the array of Prestations
    return rows as Prestation[];
  }

  async readByBarber(barberId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
      p.id_prestation,
      p.name,
      p.price,
      p.duration_minutes
      FROM prestation p  INNER JOIN propose pr ON pr.id_prestation = p.id_prestation
      WHERE pr.id_user = ?`,
      [barberId],
    );

    return rows as Prestation[];
  }

  async create(
    prestation: Omit<Prestation, "id_prestation"> & { id_user: number },
  ) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO prestation (name, price, duration_minutes) VALUES (?, ?, ?)",
      [prestation.name, prestation.price, prestation.duration_minutes],
    );

    await databaseClient.query(
      "INSERT INTO propose (id_user, id_prestation) VALUES (?, ?)",
      [prestation.id_user, result.insertId],
    );

    return result.insertId;
  }

  async update(
    id: number,
    prestation: Omit<Prestation, "id_prestation"> & { id_user: number },
  ) {
    await databaseClient.query<Result>(
      `UPDATE prestation p
     INNER JOIN propose pr
       ON pr.id_prestation = p.id_prestation
     SET
       p.name = ?,
       p.price = ?,
       p.duration_minutes = ?
     WHERE p.id_prestation = ?
       AND pr.id_user = ?`,
      [
        prestation.name,
        prestation.price,
        prestation.duration_minutes,
        id,
        prestation.id_user,
      ],
    );
  }

  async delete(id: number, idUser: number) {
    await databaseClient.query<Result>(
      `DELETE FROM propose
     WHERE id_prestation = ?
     AND id_user = ?`,
      [id, idUser],
    );

    await databaseClient.query<Result>(
      `DELETE FROM prestation
     WHERE id_prestation = ?
     AND NOT EXISTS (
       SELECT 1
       FROM propose
       WHERE id_prestation = ?
     )`,
      [id, id],
    );
  }
}

export default new PrestationRepository();
