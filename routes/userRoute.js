import express from "express";
import {
  changePassword,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetail,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
  updateUserRole,
} from "../controller/userController.js";
import { isAdmin, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", verifyToken, getUserDetail);
router.put("/change/password", verifyToken, changePassword);
router.put("/update", verifyToken, updateProfile);

// ----------------------------------ADMIN-----------------------------------------------
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/user/:id", verifyToken, isAdmin, getSingleUser);
router.put("/user/:id", verifyToken, isAdmin, updateUserRole);
router.delete("/user/:id", verifyToken, isAdmin, deleteUser);

router.get("/logout", logout);

export default router;
