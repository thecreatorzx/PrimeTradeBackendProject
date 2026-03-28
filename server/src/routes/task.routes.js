import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/task.controller.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/", auth, create);
router.get("/", auth, getAll);
router.get("/:id", auth, getById);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);

export default router;
