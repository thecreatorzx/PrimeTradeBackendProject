import { Router } from "express";
import { getAllTasks, getAllUsers } from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.js";
import requireAdmin from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/users", auth, requireAdmin, getAllUsers);
router.get("/tasks", auth, requireAdmin, getAllTasks);

export default router;
