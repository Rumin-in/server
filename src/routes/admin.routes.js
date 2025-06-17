import { Router } from "express";
import {
  getAllListings,
  approveListing,
  rejectListing,
  updateListing,
  markAsBooked,
  getAdminAnalytics,
} from "../controllers/admin.controllers.js";

const router = Router();

router.get("/listings", getAllListings);
router.put("/listings/:id/approve", approveListing);
router.put("/listings/:id/reject", rejectListing);
router.put("/listings/:id", updateListing);
router.put("/listings/:id/book", markAsBooked);
router.get("/listings/analytics", getAdminAnalytics);

export default router;
