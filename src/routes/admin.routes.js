import { Router } from "express";
import {
  getAllListings,
  approveListing,
  rejectListing,
  updateListing,
} from "../controllers/admin.controllers.js";

const router = Router();

router.get("/listings", getAllListings);
router.put("/listings/:id/approve", approveListing);
router.put("/listings/:id/reject", rejectListing);
router.put("/listings/:id", updateListing);

export default router;
