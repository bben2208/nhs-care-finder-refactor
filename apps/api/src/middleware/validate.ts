import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({ query: req.query, params: req.params, body: req.body });
    if (!parsed.success) {
      return next({ status: 400, message: "Invalid request", details: parsed.error.flatten() });
    }
    next();
  };