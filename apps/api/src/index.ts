import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import placesRouter from "./routes/places.js";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: true }));

app.get("/", (_req, res) => res.json({ ok: true, name: "nhs-care-finder-api" }));
app.use("/places", placesRouter);

import { Request, Response, NextFunction } from "express";

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Server error", details: err.details });
  });
  app.use(cors({ origin: process.env.WEB_ORIGIN || false }));
  
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));