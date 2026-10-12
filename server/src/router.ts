import express from "express";

const router = express.Router();

import { verifyToken } from "./middleware/verifyToken";
import { requireRole, requireSelfOrAdmin } from "./middleware/authorize";
import { validateBody } from "./middleware/validate";
import { validateImageUpload } from "./middleware/validateImageUpload";
import { z } from "zod";
import appointmentActions from "./modules/appointment/appointmentActions";
import barberActions from "./modules/barber/barberActions";
import barberAvailabilityActions from "./modules/barber/barberAvailabilityActions";
import barberStatisticsActions from "./modules/barber/barberStatisticsActions";
import customerActions from "./modules/customer/customerActions";
import {
  upload as customerUpload,
  uploadCustomerAvatar,
} from "./modules/customer/customerAvatarActions";
import eventActions from "./modules/event/eventActions";
import prestationActions from "./modules/prestation/prestationActions";
import reviewActions from "./modules/review/reviewActions";
import userActions from "./modules/user/userActions";

router.get(
  "/api/appointments/barber/:id",
  verifyToken,
  requireRole("barber", "admin"),
  appointmentActions.readByBarber,
);
router.get(
  "/api/appointments/user/:id",
  verifyToken,
  requireSelfOrAdmin(),
  appointmentActions.readwithuserid,
);
router.put(
  "/api/appointments/:id/status",
  verifyToken,
  appointmentActions.updateStatus,
);
const appointmentSchema = z.object({
  appointment_date: z.string().min(16).max(30),
  location_type: z.enum(["Au salon", "A domicile"]),
  id_prestation: z.coerce.number().int().positive(),
  id_user_barber: z.coerce.number().int().positive(),
});
const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(""),
  id_appointment: z.coerce.number().int().positive(),
});
const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});
const registrationSchema = credentialsSchema.extend({
  role: z.enum(["customer", "barber"]),
  firstname: z.string().trim().min(1).max(80),
  lastname: z.string().trim().min(1).max(80),
  postalCode: z.string().trim().max(12).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  address: z.string().trim().max(255).optional().default(""),
  birthday: z.string().max(10).optional(),
  phone: z.string().trim().max(30).optional(),
});
router.post("/api/appointments", verifyToken, requireRole("customer"), validateBody(appointmentSchema), appointmentActions.create);
// --- Les routes Barbier ---
router.get("/api/barbers", barberActions.browse);
router.get("/api/barbers/:id", barberActions.read);
router.get("/api/barbers/:id/statistics", verifyToken, requireSelfOrAdmin(), barberStatisticsActions.browse);
router.get("/api/barbers/:id/availability", barberAvailabilityActions.browse);
router.get("/api/barbers/:id/prestations", prestationActions.browseByBarber);
router.get("/api/barbers/:id/portfolio", barberActions.readPortfolio);
router.put("/api/barbers/:id", verifyToken, requireSelfOrAdmin(), barberActions.edit);

router.post(
  "/api/users/:id/avatar",
  verifyToken,
  requireSelfOrAdmin(),
  customerUpload.single("avatar"),
  validateImageUpload,
  uploadCustomerAvatar,
);
router.get("/api/customers", verifyToken, requireRole("admin"), customerActions.browse);
router.get("/api/customers/:id", verifyToken, requireSelfOrAdmin(), customerActions.read);
router.put("/api/customers/:id", verifyToken, requireSelfOrAdmin(), customerActions.edit);
router.get("/api/events", eventActions.browse);

router.get("/api/prestations", prestationActions.browse);
router.post("/api/prestations", verifyToken, requireRole("barber"), prestationActions.add);
router.put("/api/prestations/:id", verifyToken, requireRole("barber"), prestationActions.edit);
router.delete("/api/prestations/:id", verifyToken, requireRole("barber"), prestationActions.destroy);
router.post("/api/reviews", verifyToken, requireRole("customer"), validateBody(reviewSchema), reviewActions.add);
router.get("/api/reviews", reviewActions.browse);
router.delete("/api/reviews/:id", verifyToken, requireRole("admin"), reviewActions.destroy);
router.get("/api/reviews/barber/:id", reviewActions.browseByBarber);
router.get("/api/users", verifyToken, requireRole("admin"), userActions.browse);
router.delete("/api/users/:id", verifyToken, requireSelfOrAdmin(), userActions.deleteUser);
router.post("/api/register", validateBody(registrationSchema), userActions.register);
router.post("/api/login", validateBody(credentialsSchema), userActions.login);
router.post("/api/forgot-password", validateBody(z.object({ email: z.string().trim().email().max(254) })), userActions.forgotPassword);

export default router;
