import { Router } from "express";
import {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
  getAllHostelsForAdmin
} from "../controllers/hostel.controllers.js";
import { protect } from "../middlewares/authenticate.middlewares.js";
import { verifyPanelAccess } from "../middlewares/authorizeRole.middlewares.js";
import upload from "../config/multer.js";

const router = Router();

// Public routes
router.get("/", getAllHostels);

// Admin only routes - Note: /admin/all must come before /:id to avoid route conflict
router.get("/admin/all", verifyPanelAccess(["admin"]), getAllHostelsForAdmin);

// Public route for single hostel
router.get("/:id", getHostelById);

// Admin only routes with file upload
router.post("/", upload.array("images", 5), verifyPanelAccess(["admin"]), createHostel);
router.put("/:id", verifyPanelAccess(["admin"]), updateHostel);
router.delete("/:id", verifyPanelAccess(["admin"]), deleteHostel);

export default router;
