import type { Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

type Barber = {
  id_user: number;
  name: string;
  description: string;
  postal_code: string;
  city: string;
  adress: string;
  delivery_radius: number;
  status: string;
  create_time: string;
  avatar_url: string;
  email: string;
  phone?: string;
  birthday?: string;
  genre?: string;
  annotations?: string;
};

class BarberRepository {
  // The R of CRUD - Read All operation
  async readAll(filters?: { startDate?: string; endDate?: string }) {
    let query = `
    SELECT
      b.*,
      u.avatar_url AS avatar_url,
      u.create_time AS create_time,
      u.email AS email,
      u.phone AS phone,
      u.birthday AS birthday,
      u.genre AS genre,
      u.annotations AS annotations,
      ROUND(AVG(r.rating), 1) AS avg_rating,
      COUNT(r.id_review) AS review_count,
      MIN(p.price) AS min_price
    FROM barber b
    JOIN users u ON b.id_user = u.id_user
    LEFT JOIN appointment a ON a.id_user_barber = b.id_user
    LEFT JOIN review r ON r.id_appointment = a.id_appointment
    LEFT JOIN propose pr ON pr.id_user = b.id_user
    LEFT JOIN prestation p ON p.id_prestation = pr.id_prestation
  `;
    const queryParams: string[] = [];
    if (filters?.startDate && filters?.endDate) {
      query += " WHERE u.create_time BETWEEN ? AND ?";
      queryParams.push(
        `${filters.startDate} 00:00:00`,
        `${filters.endDate} 23:59:59`,
      );
    }
    query += " GROUP BY b.id_user";
    const [rows] = await databaseClient.query<Rows>(query, queryParams);
    return rows as Barber[];
  }

  // The R of CRUD - Read One operation (C'est celle-ci qu'on ajoute !)
  async read(id: number) {
    const query = `
    SELECT 
      b.*,
      u.avatar_url AS avatar_url, 
      u.create_time AS create_time,
      u.email AS email,
      u.phone AS phone,
      u.birthday AS birthday,
      u.genre AS genre, 
      u.annotations AS annotations 
    FROM barber b
    JOIN users u ON b.id_user = u.id_user
    WHERE b.id_user = ?
  `;

    const [rows] = await databaseClient.query<Rows>(query, [id]);
    // On retourne le premier élément du tableau (le barbier trouvé) ou null s'il n'existe pas
    return rows[0] as Barber | undefined;
  }

  async create(data: {
    id_user: number;
    name: string;
    postal_code: string;
    city: string;
    adress: string;
  }) {
    const query = `
    INSERT INTO barber (id_user, name, postal_code, city, adress)
    VALUES (?, ?, ?, ?, ?)`;
    const [result] = await databaseClient.query(query, [
      data.id_user,
      data.name,
      data.postal_code,
      data.city,
      data.adress,
    ]);
    return result;
  }

  async readPortfolio(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id_picture AS id_portfolio, image_url, title FROM barber_portfolio WHERE id_user = ? ORDER BY id_portfolio ASC",
      [id],
    );
    return rows as { id_portfolio: number; image_url: string; title: string }[];
  }

  // The U of CRUD - Update operation
  async update(barber: Barber) {
    const barberQuery = `
    UPDATE barber 
    SET  name = ?, description = ? ,postal_code = ?, city = ?, adress = ?, status = ?, delivery_radius = ?
    WHERE id_user = ?`;
    await databaseClient.query(barberQuery, [
      barber.name,
      barber.description,
      barber.postal_code,
      barber.city,
      barber.adress,
      barber.status,
      barber.delivery_radius,
      barber.id_user,
    ]);

    const usersQuery = `
    UPDATE users 
    SET email = ?, avatar_url = ?, phone = ?, birthday = ?, genre = ?, annotations = ?
    WHERE id_user = ?`;
    await databaseClient.query(usersQuery, [
      barber.email,
      barber.avatar_url,
      barber.phone,
      barber.birthday,
      barber.genre,
      barber.annotations,
      barber.id_user,
    ]);

    return true;
  }
}

export default new BarberRepository();
