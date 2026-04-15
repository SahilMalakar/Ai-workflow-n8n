import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import healthRoutes from "./routes/healthRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import { logger } from "./middleware/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use("/api", healthRoutes);
app.use("/api", resourceRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
