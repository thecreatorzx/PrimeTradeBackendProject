import prisma from "../config/db.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);
    res.status(200).json({ success: true, data: users, total: totalCount });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const [tasks, totalCount] = await prisma.$transaction([
      prisma.task.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count(),
    ]);
    res.status(200).json({ success: true, data: tasks, count: totalCount });
  } catch (error) {
    next(error);
  }
};
