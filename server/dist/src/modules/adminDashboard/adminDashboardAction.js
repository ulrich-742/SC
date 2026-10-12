"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appointmentRepository_1 = __importDefault(require("../appointment/appointmentRepository"));
const barberRepository_1 = __importDefault(require("../barber/barberRepository"));
const reviewRepository_1 = __importDefault(require("../review/reviewRepository"));
const userRepository_1 = __importDefault(require("../user/userRepository"));
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
    try {
        // Fetch all barbers, appointments, reviews, and users
        const { startDate, endDate } = req.query;
        const [barbers, appointments, reviews, users] = await Promise.all([
            barberRepository_1.default.readAll({
                startDate: typeof startDate === "string" ? startDate : undefined,
                endDate: typeof endDate === "string" ? endDate : undefined,
            }),
            appointmentRepository_1.default.readAll({
                startDate: typeof startDate === "string" ? startDate : undefined,
                endDate: typeof endDate === "string" ? endDate : undefined,
            }),
            reviewRepository_1.default.readAll({
                startDate: typeof startDate === "string" ? startDate : undefined,
                endDate: typeof endDate === "string" ? endDate : undefined,
            }),
            userRepository_1.default.readAll({
                startDate: typeof startDate === "string" ? startDate : undefined,
                endDate: typeof endDate === "string" ? endDate : undefined,
            }),
        ]);
        // Respond with the data in JSON format
        res.json({ barbers, appointments, reviews, users });
    }
    catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};
exports.default = { browse };
//# sourceMappingURL=adminDashboardAction.js.map