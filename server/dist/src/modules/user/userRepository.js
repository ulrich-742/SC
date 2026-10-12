"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../database/client"));
class UserRepository {
    // The C of CRUD - Create operation
    async readAll(filters) {
        let query = "SELECT id_user, email, user_type, avatar_url, phone, birthday, genre, annotations, create_time FROM users";
        const queryParams = [];
        if (filters?.startDate && filters?.endDate) {
            query += " WHERE create_time BETWEEN ? AND ?";
            queryParams.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
        }
        // Execute the SQL SELECT query to retrieve all users from the "user" table
        const [rows] = await client_1.default.query(query, queryParams);
        // Return the array of users
        return rows;
    }
    async create(user) {
        const [result] = await client_1.default.query(`INSERT INTO users (email, password, user_type, phone, birthday)
      VALUES (? , ? , ?, ?, ?)`, [user.email, user.password, user.user_type, user.phone, user.birthday]);
        return result;
    }
    async readByEmail(email) {
        const [rows] = await client_1.default.query("SELECT id_user, email, password, user_type, avatar_url, phone, birthday, genre, annotations, create_time FROM users WHERE email = ?", [email]);
        return rows[0];
    }
    // The U of CRUD - Update operation
    // TODO: Implement the update operation to modify an existing user
    // async update(user: user) {
    //   ...
    // }
    async delete(id) {
        const query = "DELETE FROM users WHERE id_user = ?";
        await client_1.default.query(query, [id]);
        return true;
    }
}
exports.default = new UserRepository();
//# sourceMappingURL=userRepository.js.map