import express from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  register,
  login,
  refreshToken,
  logout,
  me,
} from "../controllers/auth.controller.js";
import validateRegister from "../middlewares/validateRegister.js";
import validateLogin from "../middlewares/validateLogin.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;