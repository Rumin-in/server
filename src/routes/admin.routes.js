import { Router } from "express";
import {
  getAllListings,
  approveListing,
  rejectListing,
  updateListing,
  markAsBooked,
  unmarkAsBooked,
  getAdminAnalytics,
  addUserBalance,
  getAllIssues,
  getAllEnquiries,
  updateImageOfListing,
  getAllInterests,
  getAllUsers,
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
router.put("/listings/:id/unbook",verifyPanelAccess(["admin", "manager"]), unmarkAsBooked);
router.get("/listings/analytics",verifyPanelAccess(["admin", "manager"]), getAdminAnalytics);
router.get("/users", verifyPanelAccess(["admin", "manager"]), getAllUsers);
router.post("/user/balance",verifyPanelAccess(["admin", "manager"]), addUserBalance);
router.get("/issues",verifyPanelAccess(["admin", "manager"]), getAllIssues);
router.get("/enquiries",verifyPanelAccess(["admin", "manager"]), getAllEnquiries);
router.get("/interests",verifyPanelAccess(["admin", "manager"]), getAllInterests);



export default router;
