import { Router } from "express";
import { body } from "express-validator";
import { addUser, editUser, getUsers, removeUser } from "../controllers/userController.js";
import { authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.get("/", authorize(ROLES.ADMIN), getUsers);
router.post(
  "/",
  authorize(ROLES.ADMIN),
  [
    body("fullName").notEmpty(),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(Object.values(ROLES))
  ],
  validate,
  addUser
);
router.patch(
  "/:id",
  authorize(ROLES.ADMIN),
  [body("role").optional().isIn(Object.values(ROLES)), body("isActive").optional().isBoolean()],
  validate,
  editUser
);
router.delete("/:id", authorize(ROLES.ADMIN), removeUser);

export default router;

