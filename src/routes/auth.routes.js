import { Router } from "express";
import {
  loginUser,
  logoutUser,
  panelLogin,
  panelRegister,
  refreshAccessToken,
  registerUser,
  updateUserProfile,
} from "../controllers/userAuth.controllers.js";
import { protect } from "../middlewares/authenticate.middlewares.js";
import upload from "../config/multer.js";

const router = Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", logoutUser);

router.post("/panel/register", panelRegister);

router.post("/panel/login", panelLogin);

router.put("/profile", protect, (req, res, next) => {
  upload.single("profilePicture")(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary error:", err);
      return res.status(500).json({
        statusCode: 500,
        data: null,
        message: err.message || "File upload failed"
      });
    }
    next();
  });
}, updateUserProfile);

export default router;
