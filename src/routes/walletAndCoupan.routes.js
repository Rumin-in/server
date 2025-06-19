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
  sendBalanceToWallet,
} from "../controllers/walletAndCoupan.controllers.js";
import { verifyPanelAccess } from "../middlewares/authorizeRole.middlewares.js";


const router = express.Router();

// Coupon Routes
router.post("/coupon", verifyPanelAccess(["admin"]), createCoupon);                   // Create new coupon
router.get("/coupons", verifyPanelAccess(["admin"]), getAllCoupons);                  // Get all coupons
router.delete("/coupon/:couponId", verifyPanelAccess(["admin"]), deleteCoupon);       // Delete coupon by ID
router.put("/coupon/:couponId", verifyPanelAccess(["admin"]), updateCoupon);          // Update coupon by ID
router.post("/coupon/apply", applyCoupon);              // Apply coupon to rent

// Wallet Balance Redeem Routes
router.post("/send-balance", verifyPanelAccess(["admin"]), sendBalanceToWallet);     // Admin: Send balance to wallet
router.get("/get-all-balance-request", verifyPanelAccess(["admin"]), getAllBalanceRequests);  // Admin: View all redeem requests
router.post("/redeem-request", redeemBalance);          // User: Create redeem request
router.put("/redeem-request/handle", verifyPanelAccess(["admin"]), handleBalanceRequest); // Admin: Approve or reject

export default router;
