import fs from "node:fs/promises";
import type { RequestHandler } from "express";

function hasValidMagic(bytes: Buffer) {
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
  return jpeg || png || webp;
}

export const validateImageUpload: RequestHandler = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const handle = await fs.open(req.file.path, "r");
    const bytes = Buffer.alloc(12);
    await handle.read(bytes, 0, 12, 0);
    await handle.close();
    if (!hasValidMagic(bytes)) {
      await fs.unlink(req.file.path).catch(() => undefined);
      return res.status(415).json({ message: "Le fichier n'est pas une image JPEG, PNG ou WebP valide" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
