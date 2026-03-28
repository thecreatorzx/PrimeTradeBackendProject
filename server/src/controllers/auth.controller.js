import pkg from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
const jwt = pkg;
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.errors[0].message });
    }

    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, cookieOptions);
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ success: false, message: parsed.error.errors[0].message });
    const { email, password } = parsed.data;
    const user = await loginUser(email, password);
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", clearCookieOptions);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const me = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
