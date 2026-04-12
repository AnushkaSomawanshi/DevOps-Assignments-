import { Router } from "express";
import { getUserById, listUsers } from "../controllers/userController.js";

const router = Router();

router.get("/", listUsers);
router.get("/:id", getUserById);

export default router;
