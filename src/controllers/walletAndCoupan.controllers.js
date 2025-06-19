import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Coupon from "../models/Coupons.models.js";
import RedeemBalanceRequest from "../models/RedeemBalanceRequests.model.js";
import User from "../models/User.models.js";

export const createCoupon = asyncHandler(async (req, res) => {
  try {
    const { code, discountPercent, validTill, minRent, usageLimit } = req.body;

    if (!code || !discountPercent || !validTill || !minRent || !usageLimit) {
      throw new ApiError(400, "Missing required coupon details.");
    }
    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      throw new ApiError(400, "Coupon with this code already exists.");
    }

    const newCoupon = new Coupon({
      code,
      discountPercent,
      validTill: new Date(validTill),
      minRent,
      usageLimit,
    });

    await newCoupon.save();
    res
      .status(201)
      .json(new ApiResponse(201, newCoupon, "Coupon created successfully."));
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    if (!coupons || coupons.length === 0) {
      return res.status(404).json(new ApiError(404, "No coupons found."));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, { coupons }, "All coupons fetched successfully.")
      );
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal server error while fetching coupons."));
  }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const { couponId } = req.params;

    if (!couponId) {
      throw new ApiError(400, "Coupon ID is required.");
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!deletedCoupon) {
      throw new ApiError(404, "Coupon not found.");
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Coupon deleted successfully."));
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal server error while deleting coupon."));
  }
});

export const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { couponId } = req.params;
    const { code, discountPercent, validTill, minRent, usageLimit } = req.body;

    if (!couponId) {
      throw new ApiError(400, "Coupon ID is required.");
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        code,
        discountPercent,
        validTill: new Date(validTill),
        minRent,
        usageLimit,
      },
      { new: true }
    );

    if (!updatedCoupon) {
      throw new ApiError(404, "Coupon not found.");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedCoupon, "Coupon updated successfully.")
      );
  } catch (error) {
    console.error("Error updating coupon:", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal server error while updating coupon."));
  }
});

export const applyCoupon = asyncHandler(async (req, res) => {
  try {
    const { code, rent } = req.body;

    if (!code || !rent) {
      throw new ApiError(400, "Coupon code and rent amount are required.");
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      throw new ApiError(404, "Coupon not found.");
    }

    if (new Date() > coupon.validTill) {
      throw new ApiError(400, "Coupon has expired.");
    }

    if (rent < coupon.minRent) {
      throw new ApiError(
        400,
        `Minimum rent for this coupon is ${coupon.minRent}.`
      );
    }

    const discountAmount = (rent * coupon.discountPercent) / 100;
    res
      .status(200)
      .json(
        new ApiResponse(200, { discountAmount }, "Coupon applied successfully.")
      );
  } catch (error) {
    console.error("Error applying coupon:", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal server error while applying coupon."));
  }
});

export const getAllBalanceRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await RedeemBalanceRequest.find();
    if (!requests || requests.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, "No redeem balance requests found."));
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { requests },
          "All redeem balance requests fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching redeem balance requests:", error);
    res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error while fetching redeem balance requests."
        )
      );
  }
});

export const handleBalanceRequest = asyncHandler(async (req, res) => {
  try {
    const { requestId, action } = req.body;

    if (!requestId || !action) {
      throw new ApiError(400, "Request ID and action are required.");
    }

    const request = await RedeemBalanceRequest.findById(requestId);
    if (!request) {
      throw new ApiError(404, "Redeem balance request not found.");
    }

    if (action === "approve") {
      request.status = "approved";
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      throw new ApiError(400, "Invalid action. Use 'approve' or 'reject'.");
    }

    await request.save();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { request },
          `Redeem balance request ${action}d successfully.`
        )
      );
  } catch (error) {
    console.error("Error handling redeem balance request:", error);
    res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error while handling redeem balance request."
        )
      );
  }
});

export const redeemBalance = asyncHandler(async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      throw new ApiError(400, "User ID and amount are required.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (amount < 500) {
      throw new ApiError(400, "Minimum redeemable amount is 500.");
    }

    if (user.walletBalance < amount) {
      throw new ApiError(400, "Insufficient balance.");
    }

    const balaceRequest = await RedeemBalanceRequest.create({
      amount,
      userId: user._id,
      status: "pending",
    });

    if (!balaceRequest) {
      throw new ApiError(500, "Failed to create redeem balance request.");
    }

    await balaceRequest.save();

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Wallet balance redeem request sent !"));
  } catch (error) {
    console.error("Error redeeming balance:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const sendBalanceToWallet = asyncHandler(async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      throw new ApiError(400, "User ID and amount are required.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      throw new ApiError(400, "Amount must be a valid number.");
    }

    user.walletBalance += numericAmount;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Balance added to wallet successfully."));
  } catch (error) {
    console.error("Error adding balance to wallet:", error);
    res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error while adding balance to wallet."
        )
      );
  }
});
