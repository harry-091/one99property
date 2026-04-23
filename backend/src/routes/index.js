import { Router } from "express";
import authRoutes from "./authRoutes.js";
import leadRoutes from "./leadRoutes.js";
import reportRoutes from "./reportRoutes.js";
import userRoutes from "./userRoutes.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "one99-properties-api" });
});

router.use("/auth", authRoutes);
router.use("/users", authenticate, userRoutes);
router.use("/leads", authenticate, leadRoutes);
router.use("/reports", authenticate, reportRoutes);

export default router;

