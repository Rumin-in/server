import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    landlordName:{
        type: String,
        required: true
    },
    landlordMobileNo: {
        type: String,
        required: true
    },
      location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  rent: {
    type: Number,
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
});

const Referral = mongoose.model("Referral", referralSchema);
export default Referral;