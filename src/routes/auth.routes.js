import { Router } from "express";
import {
  loginUser,
  logoutUser,
  panelLogin,
  panelRegister,
  refreshAccessToken,
  registerUser,
} from "../controllers/userAuth.controllers.js";

const router = Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", logoutUser);

router.post("/panel/register", panelRegister);

router.post("/panel/login", panelLogin);

export default router;
