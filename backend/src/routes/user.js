import { Router } from "express";
import { getUsers, createUser, loginUser, logoutUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Get all users (protected)
router.get("/", authMiddleware, getUsers);

// Register new user
router.post("/", createUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Check currently authenticated user
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

export default router;
