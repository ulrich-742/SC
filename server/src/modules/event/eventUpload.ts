import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";

const uploadsRoot =
  process.env.UPLOADS_ROOT ??
  path.join(__dirname, "../../../../server/public/uploads");

const uploadsDir = path.join(uploadsRoot, "events");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const eventId = req.params.id || "new";
    cb(null, `event-${eventId}-${randomUUID()}${ext}`);
  },
});

export const uploadEventImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});
