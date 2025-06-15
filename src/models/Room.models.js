import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  rent: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  availabilityStatus: {
    type: String,
    enum: ['available', 'booked', 'pending'],
    default: 'available'
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;
