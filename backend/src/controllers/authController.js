import { matchedData } from "express-validator";
import { loginUser, registerUser } from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    const data = await registerUser(payload);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    const data = await loginUser(payload);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

