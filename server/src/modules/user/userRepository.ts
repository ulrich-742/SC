import type { ResultSetHeader } from "mysql2";
import type { Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

type User = {
  id_user: number;
  email: string;
  password: string;
  forget_password: string;
  user_type: string;
  avatrar_url: string;
  created_time: Date;
};

class UserRepository {
  // The C of CRUD - Create operation

  async readAll(filters?: { startDate?: string; endDate?: string }) {
    let query = "SELECT id_user, email, user_type, avatar_url, phone, birthday, genre, annotations, create_time FROM users";
    const queryParams: string[] = [];
    if (filters?.startDate && filters?.endDate) {
      query += " WHERE create_time BETWEEN ? AND ?";
      queryParams.push(
        `${filters.startDate} 00:00:00`,
        `${filters.endDate} 23:59:59`,
      );
    }
    // Execute the SQL SELECT query to retrieve all users from the "user" table
    const [rows] = await databaseClient.query<Rows>(query, queryParams);

    // Return the array of users
    return rows as User[];
  }
  async create(user: {
    email: string;
    password: string;
    user_type: string;
    phone?: string;
    birthday: string;
  }) {
    const [result] = await databaseClient.query<ResultSetHeader>(
      `INSERT INTO users (email, password, user_type, phone, birthday)
      VALUES (? , ? , ?, ?, ?)`,
      [user.email, user.password, user.user_type, user.phone, user.birthday],
    );
    return result;
  }

  async readByEmail(email: string) {
    const [rows] = await databaseClient.query(
      "SELECT id_user, email, password, user_type, avatar_url, phone, birthday, genre, annotations, create_time FROM users WHERE email = ?",
      [email],
    );
    return (rows as User[])[0];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing user

  // async update(user: user) {
  //   ...
  // }
  async delete(id: number) {
    const query = "DELETE FROM users WHERE id_user = ?";
    await databaseClient.query(query, [id]);
    return true;
  }
  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an user by its ID

  // async delete(id: number) {
  //   ...
  // }
}

export default new UserRepository();
