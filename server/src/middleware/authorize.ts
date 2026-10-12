import type { RequestHandler } from "express";

export type UserRole = "customer" | "barber" | "admin";

export const requireRole = (...roles: UserRole[]): RequestHandler =>
  (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (!roles.includes(req.user.role as UserRole)) return res.sendStatus(403);
    next();
  };

export const requireSelfOrAdmin = (param = "id"): RequestHandler =>
  (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    const resourceOwnerId = Number(req.params[param]);
    if (!Number.isInteger(resourceOwnerId)) {
      return res.status(400).json({ message: "Identifiant invalide" });
    }
    if (req.user.role !== "admin" && req.user.id !== resourceOwnerId) {
      return res.sendStatus(403);
    }
    next();
  };
