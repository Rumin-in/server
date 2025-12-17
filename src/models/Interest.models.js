import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: false
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: false
  },
  itemType: {
    type: String,
    enum: ['room', 'hostel'],
    required: true
  },
  type: {
    type: String,
    enum: ['visit', 'book'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Ensure at least one of roomId or hostelId is present
interestSchema.pre('save', function(next) {
  if (!this.roomId && !this.hostelId) {
    next(new Error('Either roomId or hostelId must be provided'));
  } else {
    next();
  }
});

const Interest = mongoose.model('Interest', interestSchema);
export default Interest;
