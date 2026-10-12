"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const barberAvailabilityRepository_1 = __importDefault(require("./barberAvailabilityRepository"));
// GET /api/barbers/:id/availability?date=YYYY-MM-DD
const browse = async (req, res, next) => {
    try {
        const barberId = Number(req.params.id);
        const date = req.query.date;
        if (!date) {
            res.status(400).json({ message: "Paramètre date requis (YYYY-MM-DD)" });
            return;
        }
        const slots = await barberAvailabilityRepository_1.default.readAvailable(barberId, date);
        res.json(slots);
    }
    catch (err) {
        next(err);
    }
};
// PUT /api/barbers/:id/schedule
const generate = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        if (Number(req.params.id) !== req.user.id) {
            return res.sendStatus(403);
        }
        const barberId = req.user.id;
        const { schedule } = req.body;
        if (!schedule || !Array.isArray(schedule)) {
            res.status(400).json({ message: "schedule requis (tableau)" });
            return;
        }
        const count = await barberAvailabilityRepository_1.default.generateFromSchedule(barberId, schedule);
        res.json({ message: "Créneaux générés", count });
    }
    catch (err) {
        next(err);
    }
};
exports.default = { browse, generate };
//# sourceMappingURL=barberAvailabilityActions.js.map