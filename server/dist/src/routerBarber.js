"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routerBarber = express_1.default.Router();
const verifyBarber_1 = require("./middleware/verifyBarber");
const verifyToken_1 = require("./middleware/verifyToken");
const authorize_1 = require("./middleware/authorize");
const validateImageUpload_1 = require("./middleware/validateImageUpload");
const appointmentActions_1 = __importDefault(require("./modules/appointment/appointmentActions"));
const barberActions_1 = __importDefault(require("./modules/barber/barberActions"));
const barberAvailabilityActions_1 = __importDefault(require("./modules/barber/barberAvailabilityActions"));
const barberAvatarActions_1 = require("./modules/barber/barberAvatarActions");
const barberStatisticsActions_1 = __importDefault(require("./modules/barber/barberStatisticsActions"));
const prestationActions_1 = __importDefault(require("./modules/prestation/prestationActions"));
routerBarber.use(verifyToken_1.verifyToken, verifyBarber_1.verifyBarber);
routerBarber.post("/prestations", prestationActions_1.default.add);
routerBarber.put("/prestations/:id", prestationActions_1.default.edit);
routerBarber.delete("/prestations/:id", prestationActions_1.default.destroy);
routerBarber.put("/:id", (0, authorize_1.requireSelfOrAdmin)(), barberActions_1.default.edit);
routerBarber.post("/:id/avatar", (0, authorize_1.requireSelfOrAdmin)(), barberAvatarActions_1.upload.single("avatar"), validateImageUpload_1.validateImageUpload, barberAvatarActions_1.uploadAvatar);
routerBarber.put("/:id/schedule", (0, authorize_1.requireSelfOrAdmin)(), barberAvailabilityActions_1.default.generate);
routerBarber.get("/:id/appointments", (0, authorize_1.requireSelfOrAdmin)(), appointmentActions_1.default.readByBarber);
routerBarber.put("/appointments/:id/status", appointmentActions_1.default.updateStatus);
routerBarber.get("/:id/statistics", (0, authorize_1.requireSelfOrAdmin)(), barberStatisticsActions_1.default.browse);
exports.default = routerBarber;
//# sourceMappingURL=routerBarber.js.map