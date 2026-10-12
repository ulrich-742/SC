"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import access to data
const prestationRepository_1 = __importDefault(require("./prestationRepository"));
// The B of BREAD - Browse (Read All) operation
const browse = async (_req, res, next) => {
    try {
        // Fetch all Prestations
        const Prestations = await prestationRepository_1.default.readAll();
        // Respond with the Prestations in JSON format
        res.json(Prestations);
    }
    catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};
const add = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const { name, price, duration_minutes } = req.body;
        const insertId = await prestationRepository_1.default.create({
            name,
            price,
            duration_minutes,
            id_user: req.user.id,
        });
        res
            .status(201)
            .json({ id_prestation: insertId, name, price, duration_minutes });
    }
    catch (err) {
        next(err);
    }
};
const edit = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const id = Number(req.params.id);
        const { name, price, duration_minutes } = req.body;
        await prestationRepository_1.default.update(id, {
            name,
            price,
            duration_minutes,
            id_user: req.user.id,
        });
        res.json({
            id_prestation: id,
            name,
            price,
            duration_minutes,
        });
    }
    catch (err) {
        next(err);
    }
};
const destroy = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const id = Number(req.params.id);
        await prestationRepository_1.default.delete(id, req.user.id);
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
};
const browseByBarber = async (req, res, next) => {
    try {
        const barberId = Number(req.params.id);
        const prestations = await prestationRepository_1.default.readByBarber(barberId);
        res.json(prestations);
    }
    catch (err) {
        next(err);
    }
};
exports.default = { browse, browseByBarber, add, edit, destroy };
//# sourceMappingURL=prestationActions.js.map