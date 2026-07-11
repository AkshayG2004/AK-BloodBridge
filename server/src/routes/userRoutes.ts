import { Router } from "express";
import { registerUser } from "../controllers/userController";

const router = Router();

// Register User
router.post("/register", registerUser);

export default router;