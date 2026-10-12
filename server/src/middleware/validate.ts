import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validateBody = (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    req.body = parsed.data;
    next();
  };
