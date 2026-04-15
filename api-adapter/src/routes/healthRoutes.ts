import { Router } from "express";
import { getHealth } from "../controllers/healthController";

const router: Router = Router();

router.get("/health", getHealth);

export default router;
