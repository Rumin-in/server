import { Router } from "express";
import {
  getAllListings,
  approveListing,
  rejectListing,
  updateListing,
  markAsBooked,
  getAdminAnalytics,
  addUserBalance,
  getAllIssues,
  getAllEnquiries,
  updateImageOfListing,
} from "../controllers/admin.controllers.js";
import upload from "../config/multer.js";
import { verifyPanelAccess } from "../middlewares/authorizeRole.middlewares.js";


const router = Router();

router.get("/listings",verifyPanelAccess(["admin", "manager"]), getAllListings);
router.put("/listings/:id/approve",verifyPanelAccess(["admin", "manager"]), approveListing);
router.put("/listings/:id/reject",verifyPanelAccess(["admin", "manager"]), rejectListing);
router.put("/listings/:id",verifyPanelAccess(["admin", "manager"]), updateListing);
router.put("/listings/:id/image",upload.array("images", 5),verifyPanelAccess(["admin", "manager"]),  updateImageOfListing);
router.put("/listings/:id/book",verifyPanelAccess(["admin", "manager"]), markAsBooked);
router.get("/listings/analytics",verifyPanelAccess(["admin", "manager"]), getAdminAnalytics);
router.post("/user/balance",verifyPanelAccess(["admin"]), addUserBalance);
router.get("/issues",verifyPanelAccess(["admin", "manager"]), getAllIssues);
router.get("/enquiries",verifyPanelAccess(["admin", "manager"]), getAllEnquiries);



export default router;
