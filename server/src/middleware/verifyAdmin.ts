import type { NextFunction, Request, Response } from "express";
import client from "../../database/client";

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const [rows] = await client.query("SELECT 1 FROM admin WHERE id_user = ?", [
      userId,
    ]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Accès refusé : Vous n'êtes pas un administrateur" });
    }

    next();
  } catch (error) {
    console.error("Erreur dans verifyAdmin:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
