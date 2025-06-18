import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discountPercent: Number,
  validTill: Date,
  minRent: Number,
  usageLimit: Number,
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;

