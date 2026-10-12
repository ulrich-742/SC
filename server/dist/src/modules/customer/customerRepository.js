"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../database/client"));
class CustomerRepository {
    // The C of CRUD - Create operation
    async readAll() {
        // Execute the SQL SELECT query to retrieve all Customers from the "Customer" table
        const query = `
      SELECT 
        c.*,
        u.avatar_url AS avatar_url, 
        u.create_time AS create_time,
        u.email AS email,
        u.phone AS phone,
        u.birthday AS birthday,
        u.genre AS genre, 
        u.annotations AS annotations 
      FROM customer c
      JOIN users u ON c.id_user = u.id_user
    `;
        const [rows] = await client_1.default.query(query);
        // Return the array of Customers
        return rows;
    }
    async read(id) {
        const query = `
    SELECT
      c.*,
      u.avatar_url,
      u.create_time,
      u.email,
      u.phone,
      u.birthday,
      u.genre,
      u.annotations
    FROM customer c
    JOIN users u ON c.id_user = u.id_user
    WHERE c.id_user = ?
  `;
        const [rows] = await client_1.default.query(query, [id]);
        if (!rows || rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    // The U of CRUD - Update operation
    // TODO: Implement the update operation to modify an existing Customer
    async update(customer) {
        const customerQuery = `
    UPDATE customer
    SET firstname = ?, lastname = ?, postal_code = ?, city = ?, adress = ?, status = ?
    WHERE id_user = ?`;
        await client_1.default.query(customerQuery, [
            customer.firstname,
            customer.lastname,
            customer.postal_code,
            customer.city,
            customer.adress,
            customer.status,
            customer.id_user,
        ]);
        const usersQuery = `
    UPDATE users
    SET email = ?, avatar_url = ?, phone = ?, birthday = ?, genre = ?, annotations = ?
    WHERE id_user = ?`;
        await client_1.default.query(usersQuery, [
            customer.email,
            customer.avatar_url,
            customer.phone,
            customer.birthday,
            customer.genre,
            customer.annotations,
            customer.id_user,
        ]);
        return true;
    }
    async create(customer) {
        console.log("CUSTOMER CREATE:", customer);
        const query = `
    INSERT INTO customer
    (id_user, firstname, lastname, postal_code, city, adress)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
        const [result] = await client_1.default.query(query, [
            customer.id_user,
            customer.firstname,
            customer.lastname,
            customer.postal_code,
            customer.city,
            customer.adress,
        ]);
        console.log("CUSTOMER INSERT RESULT:", result);
    }
}
// The D of CRUD - Delete operation
// TODO: Implement the delete operation to remove an Customer by its ID
// async delete(id: number) {
//   ...
// }
exports.default = new CustomerRepository();
//# sourceMappingURL=customerRepository.js.map