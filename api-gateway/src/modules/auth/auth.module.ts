import { Router } from "express";
import { getToken, getInfo } from "./auth.controller";

const router = Router();

router.post("/token", getToken);
router.get("/info", getInfo);

export default router;
