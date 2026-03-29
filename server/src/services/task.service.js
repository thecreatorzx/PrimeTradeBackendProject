import prisma from "../config/db.js";

export const createTask = async (title, description, status, userId) => {
  const task = await prisma.task.create({
    data: { title, description, status, userId },
  });
  return task;
};

export const getAllTasks = async (userId, role) => {
  return await prisma.task.findMany({ where: { userId } });
};

export const getTaskById = async (id, userId, role) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }
  if (task.userId !== userId && role !== "admin") {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }
  return task;
};

export const updateTask = async (id, userId, role, data) => {
  await getTaskById(id, userId, role);
  const task = await prisma.task.update({
    where: { id },
    data,
  });
  return task;
};

export const deleteTask = async (id, userId, role) => {
  await getTaskById(id, userId, role);
  await prisma.task.delete({ where: { id } });
};
