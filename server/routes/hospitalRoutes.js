import { Router } from "express";
import { getHospitalById, listHospitals } from "../controllers/hospitalController.js";

const router = Router();

router.get("/", listHospitals);
router.get("/:id", getHospitalById);

export default router;
