import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middlewares/errorHandler.js";
import authRouter from "./src/routes/auth.routes.js";
import taskRouter from "./src/routes/task.routes.js";
import adminRouter from "./src/routes/admin.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use(errorHandler);
export default app;
