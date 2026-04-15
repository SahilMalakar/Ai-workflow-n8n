import { Router } from "express";
import {
  createResource,
  listResources,
  updateResource,
  deleteResource,
} from "../controllers/resourceController";

const router: Router = Router();

router.get("/:resource", listResources);
router.post("/:resource", createResource);
router.patch("/:resource/:id", updateResource);
router.delete("/:resource/:id", deleteResource);

export default router;
