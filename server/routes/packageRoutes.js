import { Router } from "express";
import { listPackages } from "../controllers/packageController.js";

const router = Router();

router.get("/", listPackages);

export default router;
