import type { RequestHandler } from "express";

export const verifyBarber: RequestHandler = (req, res, next) => {
  if (req.user?.role !== "barber") {
    return res.sendStatus(403);
  }

  next();
};
