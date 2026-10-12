"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import access to data
const customerRepository_1 = __importDefault(require("./customerRepository"));
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
    try {
        if (req.user?.role !== "admin") {
            return res.sendStatus(403);
        }
        const customers = await customerRepository_1.default.readAll();
        res.json(customers);
    }
    catch (err) {
        next(err);
    }
};
const read = async (req, res, next) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.sendStatus(403);
        }
        // Fetch all customers
        const customer = await customerRepository_1.default.read(Number(req.params.id));
        // Respond with the customers in JSON format
        res.json(customer);
    }
    catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};
const edit = async (req, res, next) => {
    try {
        if (req.user?.id !== Number(req.params.id) && req.user?.role !== "admin") {
            return res.sendStatus(403);
        }
        const id_user = Number(req.params.id);
        const updatedCustomerData = { ...req.body, id_user };
        await customerRepository_1.default.update(updatedCustomerData);
        res.status(200).json({
            message: "Client mis à jour avec succès",
            data: updatedCustomerData,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.default = { browse, edit, read };
//# sourceMappingURL=customerActions.js.map