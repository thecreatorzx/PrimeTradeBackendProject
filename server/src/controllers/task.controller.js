import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../services/task.service.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

export const create = async (req, res, next) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ success: false, message: parsed.error.errors[0].message });
    const { title, description, status } = parsed.data;
    const task = await createTask(title, description, status, req.user.id);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
export const getAll = async (req, res, next) => {
  try {
    const tasks = await getAllTasks(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const task = await getTaskById(
      Number(req.params.id),
      req.user.id,
      req.user.role,
    );
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ success: false, message: parsed.error.errors[0].message });
    const task = await updateTask(
      Number(req.params.id),
      req.user.id,
      req.user.role,
      parsed.data,
    );
    res.status(200).json({
      success: true,
      message: "Task updated",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
export const remove = async (req, res, next) => {
  try {
    await deleteTask(Number(req.params.id), req.user.id, req.user.role);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
