"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const verifyToken_1 = require("./middleware/verifyToken");
const authorize_1 = require("./middleware/authorize");
const validate_1 = require("./middleware/validate");
const validateImageUpload_1 = require("./middleware/validateImageUpload");
const zod_1 = require("zod");
const appointmentActions_1 = __importDefault(require("./modules/appointment/appointmentActions"));
const barberActions_1 = __importDefault(require("./modules/barber/barberActions"));
const barberAvailabilityActions_1 = __importDefault(require("./modules/barber/barberAvailabilityActions"));
const barberStatisticsActions_1 = __importDefault(require("./modules/barber/barberStatisticsActions"));
const customerActions_1 = __importDefault(require("./modules/customer/customerActions"));
const customerAvatarActions_1 = require("./modules/customer/customerAvatarActions");
const eventActions_1 = __importDefault(require("./modules/event/eventActions"));
const prestationActions_1 = __importDefault(require("./modules/prestation/prestationActions"));
const reviewActions_1 = __importDefault(require("./modules/review/reviewActions"));
const userActions_1 = __importDefault(require("./modules/user/userActions"));
router.get("/api/appointments/barber/:id", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("barber", "admin"), appointmentActions_1.default.readByBarber);
router.get("/api/appointments/user/:id", verifyToken_1.verifyToken, (0, authorize_1.requireSelfOrAdmin)(), appointmentActions_1.default.readwithuserid);
router.put("/api/appointments/:id/status", verifyToken_1.verifyToken, appointmentActions_1.default.updateStatus);
const appointmentSchema = zod_1.z.object({
    appointment_date: zod_1.z.string().min(16).max(30),
    location_type: zod_1.z.enum(["Au salon", "A domicile"]),
    id_prestation: zod_1.z.coerce.number().int().positive(),
    id_user_barber: zod_1.z.coerce.number().int().positive(),
});
const reviewSchema = zod_1.z.object({
    rating: zod_1.z.coerce.number().int().min(1).max(5),
    comment: zod_1.z.string().trim().max(2000).optional().default(""),
    id_appointment: zod_1.z.coerce.number().int().positive(),
});
const credentialsSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email().max(254),
    password: zod_1.z.string().min(1).max(128),
});
const registrationSchema = credentialsSchema.extend({
    role: zod_1.z.enum(["customer", "barber"]),
    firstname: zod_1.z.string().trim().min(1).max(80),
    lastname: zod_1.z.string().trim().min(1).max(80),
    postalCode: zod_1.z.string().trim().max(12).optional().default(""),
    city: zod_1.z.string().trim().max(100).optional().default(""),
    address: zod_1.z.string().trim().max(255).optional().default(""),
    birthday: zod_1.z.string().max(10).optional(),
    phone: zod_1.z.string().trim().max(30).optional(),
});
router.post("/api/appointments", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("customer"), (0, validate_1.validateBody)(appointmentSchema), appointmentActions_1.default.create);
// --- Les routes Barbier ---
router.get("/api/barbers", barberActions_1.default.browse);
router.get("/api/barbers/:id", barberActions_1.default.read);
router.get("/api/barbers/:id/statistics", verifyToken_1.verifyToken, (0, authorize_1.requireSelfOrAdmin)(), barberStatisticsActions_1.default.browse);
router.get("/api/barbers/:id/availability", barberAvailabilityActions_1.default.browse);
router.get("/api/barbers/:id/prestations", prestationActions_1.default.browseByBarber);
router.get("/api/barbers/:id/portfolio", barberActions_1.default.readPortfolio);
router.put("/api/barbers/:id", verifyToken_1.verifyToken, (0, authorize_1.requireSelfOrAdmin)(), barberActions_1.default.edit);
router.post("/api/users/:id/avatar", verifyToken_1.verifyToken, (0, authorize_1.requireSelfOrAdmin)(), customerAvatarActions_1.upload.single("avatar"), validateImageUpload_1.validateImageUpload, customerAvatarActions_1.uploadCustomerAvatar);
router.get("/api/customers", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("admin"), customerActions_1.default.browse);
router.get("/api/customers/:id", verifyToken_1.verifyToken, (0, authorize_1.requireSelfOrAdmin)(), customerActions_1.default.read);
router.put("/api/customers/:id", verifyToken_1.verifyToken, (0, authorize_1.requireSelfOrAdmin)(), customerActions_1.default.edit);
router.get("/api/events", eventActions_1.default.browse);
router.get("/api/prestations", prestationActions_1.default.browse);
router.post("/api/prestations", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("barber"), prestationActions_1.default.add);
router.put("/api/prestations/:id", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("barber"), prestationActions_1.default.edit);
router.delete("/api/prestations/:id", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("barber"), prestationActions_1.default.destroy);
router.post("/api/reviews", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("customer"), (0, validate_1.validateBody)(reviewSchema), reviewActions_1.default.add);
router.get("/api/reviews", reviewActions_1.default.browse);
router.delete("/api/reviews/:id", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("admin"), reviewActions_1.default.destroy);
router.get("/api/reviews/barber/:id", reviewActions_1.default.browseByBarber);
router.get("/api/users", verifyToken_1.verifyToken, (0, authorize_1.requireRole)("admin"), userActions_1.default.browse);
router.delete("/api/users/:id", verifyToken_1.verifyToken, (0, authorize_1.requireSelfOrAdmin)(), userActions_1.default.deleteUser);
router.post("/api/register", (0, validate_1.validateBody)(registrationSchema), userActions_1.default.register);
router.post("/api/login", (0, validate_1.validateBody)(credentialsSchema), userActions_1.default.login);
router.post("/api/forgot-password", (0, validate_1.validateBody)(zod_1.z.object({ email: zod_1.z.string().trim().email().max(254) })), userActions_1.default.forgotPassword);
exports.default = router;
//# sourceMappingURL=router.js.map