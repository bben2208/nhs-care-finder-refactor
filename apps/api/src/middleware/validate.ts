// apps/api/src/middleware/validate.ts
import { ZodSchema } from "zod";
export const validate =
  (schema: ZodSchema) =>
  (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => {
    const parse = schema.safeParse({ query: req.query, params: req.params, body: req.body });
    if (!parse.success) return next({ status: 400, message: "Invalid request", details: parse.error.flatten() });
    Object.assign(req, parse.data); // optional: attach parsed
    next();
  };