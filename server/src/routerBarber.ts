import express from "express";

const routerBarber = express.Router();

import { verifyBarber } from "./middleware/verifyBarber";
import { verifyToken } from "./middleware/verifyToken";
import { requireSelfOrAdmin } from "./middleware/authorize";
import { validateImageUpload } from "./middleware/validateImageUpload";
import appointmentActions from "./modules/appointment/appointmentActions";
import barberActions from "./modules/barber/barberActions";
import barberAvailabilityActions from "./modules/barber/barberAvailabilityActions";
import {
  upload as barberUpload,
  uploadAvatar,
} from "./modules/barber/barberAvatarActions";
import barberStatisticsActions from "./modules/barber/barberStatisticsActions";
import prestationActions from "./modules/prestation/prestationActions";

routerBarber.use(verifyToken, verifyBarber);
routerBarber.post("/prestations", prestationActions.add);
routerBarber.put("/prestations/:id", prestationActions.edit);
routerBarber.delete("/prestations/:id", prestationActions.destroy);
routerBarber.put("/:id", requireSelfOrAdmin(), barberActions.edit);
routerBarber.post("/:id/avatar", requireSelfOrAdmin(), barberUpload.single("avatar"), validateImageUpload, uploadAvatar);
routerBarber.put("/:id/schedule", requireSelfOrAdmin(), barberAvailabilityActions.generate);
routerBarber.get("/:id/appointments", requireSelfOrAdmin(), appointmentActions.readByBarber);
routerBarber.put("/appointments/:id/status", appointmentActions.updateStatus);
routerBarber.get("/:id/statistics", requireSelfOrAdmin(), barberStatisticsActions.browse);
export default routerBarber;
