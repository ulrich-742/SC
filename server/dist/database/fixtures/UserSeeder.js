"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractSeeder_1 = __importDefault(require("./AbstractSeeder"));
class UserSeeder extends AbstractSeeder_1.default {
    constructor() {
        // Call the constructor of the parent class (AbstractSeeder) with appropriate options
        super({ table: "user", truncate: true });
    }
    // The run method - Populate the 'user' table with fake data
    run() {
        // Generate and insert fake data into the 'user' table
        for (let i = 0; i < 10; i += 1) {
            // Generate fake user data
            const fakeUser = {
                email: this.faker.internet.email(), // Generate a fake email using faker library
                password: this.faker.internet.password(), // Generate a fake password using faker library
                refName: `user_${i}`, // Create a reference name for the user
            };
            // Insert the fakeUser data into the 'user' table
            this.insert(fakeUser); // insert into user(email, password) values (?, ?)
        }
    }
}
// Export the UserSeeder class
exports.default = UserSeeder;
//# sourceMappingURL=UserSeeder.js.map