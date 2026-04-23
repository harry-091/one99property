import { Router } from "express";
import { calendar, delayAlerts, exportCsv, exportPdfPlaceholder, summary } from "../controllers/reportController.js";
import { authorize } from "../middleware/auth.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.get("/summary", authorize(ROLES.MANAGER, ROLES.ADMIN), summary);
router.get("/calendar", authorize(ROLES.MANAGER, ROLES.ADMIN), calendar);
router.get("/delay-alerts", authorize(ROLES.ADMIN), delayAlerts);
router.get("/export/csv", authorize(ROLES.ADMIN, ROLES.MANAGER), exportCsv);
router.get("/export/pdf", authorize(ROLES.ADMIN, ROLES.MANAGER), exportPdfPlaceholder);

export default router;

