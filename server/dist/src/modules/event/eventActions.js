"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import access to data
const eventRepository_1 = __importDefault(require("./eventRepository"));
const formatToMySQLDateTime = (localDateTimeString) => {
    if (!localDateTimeString)
        return "";
    return `${localDateTimeString.replace("T", " ")}:00`;
};
// The B of BREAD - Browse (Read All) operation
const browse = async (_req, res, next) => {
    try {
        // Fetch all event
        const event = await eventRepository_1.default.readAll();
        // Respond with the event in JSON format
        res.json(event);
    }
    catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};
const edit = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { title, description, status, start_date, end_date, location } = req.body;
        const image_url = req.file
            ? `/uploads/events/${req.file.filename}`
            : undefined;
        const formattedStartDate = formatToMySQLDateTime(start_date);
        const formattedEndDate = formatToMySQLDateTime(end_date);
        const affectedRows = await eventRepository_1.default.update(id, {
            title,
            description,
            status,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            location,
            image_url,
        });
        if (affectedRows === 0) {
            res.status(404).json({ error: "Événement introuvable" });
            return;
        }
        res.json({ message: "Événement mis à jour avec succès" });
    }
    catch (err) {
        next(err);
    }
};
const add = async (req, res, next) => {
    try {
        const { title, description, status, start_date, end_date, location } = req.body;
        const image_url = req.file ? `/uploads/events/${req.file.filename}` : "";
        const formattedStartDate = formatToMySQLDateTime(start_date);
        const formattedEndDate = formatToMySQLDateTime(end_date);
        const insertId = await eventRepository_1.default.create({
            title,
            description,
            status,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            location,
            image_url,
        });
        res.status(201).json({
            id_event: insertId,
            title,
            description,
            status,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            location,
            image_url,
        });
    }
    catch (err) {
        next(err);
    }
};
const destroy = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const affectedRows = await eventRepository_1.default.delete(id);
        if (affectedRows === 0) {
            res.status(404).json({ error: "Événement introuvable" });
            return;
        }
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
};
exports.default = { browse, edit, add, destroy };
//# sourceMappingURL=eventActions.js.map