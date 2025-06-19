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

const router = Router();

router.get("/listings", getAllListings);
router.put("/listings/:id/approve", approveListing);
router.put("/listings/:id/reject", rejectListing);
router.put("/listings/:id", updateListing);
router.put("/listings/:id/image",upload.array("images", 5),  updateImageOfListing);
router.put("/listings/:id/book", markAsBooked);
router.get("/listings/analytics", getAdminAnalytics);
router.post("/user/balance", addUserBalance);
router.get("/issues", getAllIssues);
router.get("/enquiries", getAllEnquiries);

export default router;
