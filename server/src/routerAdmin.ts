import express from "express";

const routerAdmin = express.Router();

import { verifyAdmin } from "./middleware/verifyAdmin";
import { verifyToken } from "./middleware/verifyToken";
import { validateImageUpload } from "./middleware/validateImageUpload";
import adminDashboardAction from "./modules/adminDashboard/adminDashboardAction";
import appointmentActions from "./modules/appointment/appointmentActions";
import barberActions from "./modules/barber/barberActions";
import customerActions from "./modules/customer/customerActions";
import eventActions from "./modules/event/eventActions";
import { uploadEventImage } from "./modules/event/eventUpload";
import reviewActions from "./modules/review/reviewActions";
import userActions from "./modules/user/userActions";

routerAdmin.use(verifyToken, verifyAdmin);

routerAdmin.get("/dashboard", adminDashboardAction.browse);
routerAdmin.get("/appointmentsdetails", appointmentActions.browseforadmin);
routerAdmin.get("/appointments", appointmentActions.browse);
routerAdmin.get("/barbers", barberActions.browse);
routerAdmin.put("/barbers/:id", barberActions.edit);
routerAdmin.delete("/users/:id", userActions.deleteUser);
routerAdmin.post("/events", uploadEventImage.single("image"), validateImageUpload, eventActions.add);
routerAdmin.put(
  "/events/:id",
  uploadEventImage.single("image"),
  validateImageUpload,
  eventActions.edit,
);
routerAdmin.delete("/events/:id", eventActions.destroy);
routerAdmin.get("/customers", customerActions.browse);
routerAdmin.put("/customers/:id", customerActions.edit);
routerAdmin.get("/reviews", reviewActions.browse);
routerAdmin.delete("/reviews/:id", reviewActions.destroy);
routerAdmin.get("/reviewsdetails", reviewActions.browseforadmin);

export default routerAdmin;
