import { Router } from "express";
import { body } from "express-validator";
import { login, me, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validate,
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty().withMessage("Password is required")],
  validate,
  login
);

router.get("/me", authenticate, me);

export default router;

