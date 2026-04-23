import { Router } from "express";
import multer from "multer";
import { body } from "express-validator";
import {
  addLead,
  assignLeadToUser,
  bookLead,
  changeLeadStatus,
  forwardHotLead,
  getLead,
  getLeads,
  leadStats,
  uploadCsv
} from "../controllers/leadController.js";
import { authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { LEAD_CATEGORIES, LEAD_STATUSES, PROPERTY_TYPES, ROLES } from "../utils/constants.js";

const router = Router();
const upload = multer();

router.get("/", getLeads);
router.get("/stats/overview", leadStats);
router.get("/:id", getLead);
router.post(
  "/",
  authorize(ROLES.CHANNEL_PARTNER, ROLES.ADMIN, ROLES.MANAGER, ROLES.RENTAL_TEAM),
  [
    body("fullName").notEmpty(),
    body("phone").notEmpty(),
    body("location").notEmpty().withMessage("Location is required"),
    body("investmentRange").notEmpty().withMessage("Investment range is required"),
    body("email").optional({ values: "falsy" }).isEmail(),
    body("leadSource").optional({ values: "falsy" }).isString(),
    body("leadCategory").optional().isIn(LEAD_CATEGORIES),
    body("propertyType").optional().isIn(PROPERTY_TYPES),
    body("notes").optional({ values: "falsy" }).isString(),
    body("assignedManagerId").optional({ values: "falsy" }).isInt()
  ],
  validate,
  addLead
);
router.post(
  "/upload-csv",
  authorize(ROLES.CHANNEL_PARTNER, ROLES.ADMIN),
  upload.single("file"),
  uploadCsv
);
router.patch(
  "/:id/status",
  authorize(ROLES.STAFF, ROLES.MANAGER, ROLES.ADMIN, ROLES.RENTAL_TEAM),
  [
    body("status").isIn(LEAD_STATUSES),
    body("nextFollowUpAt").optional({ values: "falsy" }).isISO8601(),
    body("note").optional({ values: "falsy" }).isString().trim().isLength({ max: 500 })
  ],
  validate,
  changeLeadStatus
);
router.post(
  "/:id/assign",
  authorize(ROLES.MANAGER, ROLES.ADMIN),
  [
    body("assignedTo").isInt(),
    body("assignedManagerId").optional({ values: "falsy" }).isInt(),
    body("note").optional({ values: "falsy" }).isString().trim().isLength({ max: 255 })
  ],
  validate,
  assignLeadToUser
);
router.post(
  "/:id/forward-hot",
  authorize(ROLES.STAFF, ROLES.MANAGER, ROLES.ADMIN),
  [
    body("managerId").isInt(),
    body("note").optional({ values: "falsy" }).isString().trim().isLength({ max: 500 })
  ],
  validate,
  forwardHotLead
);
router.post(
  "/:id/book",
  authorize(ROLES.MANAGER, ROLES.ADMIN),
  [
    body("bookingValue").optional({ values: "falsy" }).isFloat({ min: 0 }),
    body("note").optional({ values: "falsy" }).isString().trim().isLength({ max: 500 })
  ],
  validate,
  bookLead
);

export default router;
