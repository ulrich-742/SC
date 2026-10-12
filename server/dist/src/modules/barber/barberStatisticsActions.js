"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const barberStatisticsRepository_1 = __importDefault(require("./barberStatisticsRepository"));
const browse = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        if (Number(req.params.id) !== req.user.id) {
            return res.sendStatus(403);
        }
        const barberId = req.user.id;
        const stats = await barberStatisticsRepository_1.default.readStats(barberId);
        res.json(stats);
    }
    catch (err) {
        next(err);
    }
};
exports.default = { browse };
//# sourceMappingURL=barberStatisticsActions.js.map