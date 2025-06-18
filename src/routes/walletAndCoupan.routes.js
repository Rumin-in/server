import express from "express";
import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
  applyCoupon,
  getAllBalanceRequests,
  handleBalanceRequest,
  redeemBalance,
} from "../controllers/walletAndCoupan.controllers.js";


const router = express.Router();

// Coupon Routes
router.post("/coupon", createCoupon);                   // Create new coupon
router.get("/coupons", getAllCoupons);                  // Get all coupons
router.delete("/coupon/:couponId", deleteCoupon);       // Delete coupon by ID
router.put("/coupon/:couponId", updateCoupon);          // Update coupon by ID
router.post("/coupon/apply", applyCoupon);              // Apply coupon to rent

// Wallet Balance Redeem Routes
router.get("/redeem-requests", getAllBalanceRequests);  // Admin: View all redeem requests
router.post("/redeem-request", redeemBalance);          // User: Create redeem request
router.put("/redeem-request/handle", handleBalanceRequest); // Admin: Approve or reject

export default router;
