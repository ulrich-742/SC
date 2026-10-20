import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import multer from "multer";
import databaseClient from "../../../database/client";

const uploadsRoot =
  process.env.UPLOADS_ROOT ??
  path.join(__dirname, "../../../../server/public/uploads");

const uploadsDir = path.join(uploadsRoot, "avatars");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `barber-${req.params.id}-${randomUUID()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

export const uploadAvatar: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    if (Number(req.params.id) !== req.user.id) {
      return res.sendStatus(403);
    }

    if (!req.file) {
      res.status(400).json({ error: "Aucun fichier fourni" });
      return;
    }

    const barberId = req.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await databaseClient.query(
      "UPDATE users SET avatar_url = ? WHERE id_user = ?",
      [avatarUrl, barberId],
    );

    res.json({ avatar_url: avatarUrl });
  } catch (err) {
    next(err);
  }
};
