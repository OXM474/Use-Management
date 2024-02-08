import express from "express";
import {
  register,
  login,
  getAllUser,
  getUserInfo,
  updateUserRole,
  deleteOneUser,
  updateUserInfo,
  updateUserPassword,
} from "../controller/user_controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getUserInfo);
router.patch("/update-user-info", verifyToken, updateUserInfo);
router.patch("/update-user-password", verifyToken, updateUserPassword);
router.get("/getAllUsers", verifyToken, isAdmin([1]), getAllUser);
router.patch("/update-user-role", verifyToken, isAdmin([1]), updateUserRole);
router.delete("/delete-one-user/:id", verifyToken, isAdmin([1]), deleteOneUser);

export default router;
