"use strict";
// Import Faker library for generating fake data
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
// Import database client
const client_1 = __importDefault(require("../client"));
const refs = {};
// Provide faker access through AbstractSeed class
class AbstractSeeder {
    table;
    truncate;
    dependencies;
    promises;
    faker;
    constructor({ table, truncate = true, dependencies = [], }) {
        this.table = table;
        this.truncate = truncate;
        this.dependencies = dependencies;
        this.promises = [];
        this.faker = faker_1.faker;
    }
    async #doInsert(data) {
        // Extract ref name (if it exists)
        const { refName, ...values } = data;
        // Prepare the SQL statement: "insert into <table>(<fields>) values (<placeholders>)"
        const fields = Object.keys(values).join(",");
        const placeholders = new Array(Object.keys(values).length)
            .fill("?")
            .join(",");
        const sql = `insert into ${this.table}(${fields}) values (${placeholders})`;
        // Perform the query and if applicable store the insert id given the ref name
        const [result] = await client_1.default.query(sql, Object.values(values));
        if (refName != null) {
            const { insertId } = result;
            refs[refName] = { ...values, insertId };
        }
    }
    insert(data) {
        this.promises.push(this.#doInsert(data));
    }
    run() {
        throw new Error("You must implement this function");
    }
    getRef(name) {
        return refs[name];
    }
}
// Ready to export
exports.default = AbstractSeeder;
//# sourceMappingURL=AbstractSeeder.js.map