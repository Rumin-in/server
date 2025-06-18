import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/userAuth.controllers.js";

const router = Router();

router.post('/signup', registerUser);


router.post('/login', loginUser);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', logoutUser);

export default router;