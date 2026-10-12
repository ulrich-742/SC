"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import access to data
const reviewRepository_1 = __importDefault(require("./reviewRepository"));
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
    try {
        // Fetch all reviews
        const { startDate, endDate } = req.query;
        const reviews = await reviewRepository_1.default.readAll({
            startDate: typeof startDate === "string" ? startDate : undefined,
            endDate: typeof endDate === "string" ? endDate : undefined,
        });
        // Respond with the reviews in JSON format
        res.json(reviews);
    }
    catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};
const browseforadmin = async (req, res, next) => {
    try {
        // Fetch all reviews
        const { startDate, endDate } = req.query;
        const reviews = await reviewRepository_1.default.readAllForAdmin({
            startDate: typeof startDate === "string" ? startDate : undefined,
            endDate: typeof endDate === "string" ? endDate : undefined,
        });
        // Respond with the reviews in JSON format
        res.json(reviews);
    }
    catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};
const browseByBarber = async (req, res, next) => {
    try {
        const barberId = Number(req.params.id);
        const reviews = await reviewRepository_1.default.readByBarber(barberId);
        res.json(reviews);
    }
    catch (err) {
        next(err);
    }
};
const destroy = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await reviewRepository_1.default.delete(id);
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
};
const add = async (req, res, next) => {
    try {
        const { rating, comment, id_appointment } = req.body;
        if (!rating || !id_appointment) {
            res.status(400).json({ message: "Note et rendez-vous requis" });
            return;
        }
        const result = await reviewRepository_1.default.create({
            rating: Number(rating),
            comment: comment ?? "",
            id_appointment: Number(id_appointment),
            id_user_customer: req.user?.id,
        });
        res.status(201).json({
            message: "Avis publié",
            id: result.insertId,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.default = { browse, browseforadmin, browseByBarber, destroy, add };
//# sourceMappingURL=reviewActions.js.map