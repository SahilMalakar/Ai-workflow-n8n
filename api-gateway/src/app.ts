import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./modules/auth/auth.module";
import addressesRouter from "./modules/addresses/addresses.module";
import customersRouter from "./modules/customers/customers.module";
import projectsRouter from "./modules/projects/projects.module";
import { ordersRouter, invoicesRouter } from "./modules/commerce/commerce.module";

const app = express();

app.use(cors());
app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/addresses", addressesRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/invoices", invoicesRouter);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
