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
  getAllBalanceRequests,
  handleBalanceRequest,
} from "../controllers/admin.controllers.js";

const router = Router();

router.get("/listings", getAllListings);
router.put("/listings/:id/approve", approveListing);
router.put("/listings/:id/reject", rejectListing);
router.put("/listings/:id", updateListing);
router.put("/listings/:id/book", markAsBooked);
router.get("/listings/analytics", getAdminAnalytics);
router.post("/user/balance", addUserBalance);
router.get("/issues", getAllIssues);
router.get("/enquiries", getAllEnquiries);
router.get("/balance-requests", getAllBalanceRequests);
router.post("/balance-requests/handle", handleBalanceRequest);

export default router;
