import { Router } from "express";
import {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./addresses.controller";

const router = Router();

router.get("/", getAddresses);
router.get("/:id", getAddress);
router.post("/", createAddress);
router.patch("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
