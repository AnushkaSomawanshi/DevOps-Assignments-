import { Router } from "express";
import { getBlogById, listBlogs } from "../controllers/blogController.js";

const router = Router();

router.get("/", listBlogs);
router.get("/:id", getBlogById);

export default router;
