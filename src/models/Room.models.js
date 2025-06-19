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
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  }
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
   history: [
    {
      updatedAt: { type: Date, default: Date.now },
      data: mongoose.Schema.Types.Mixed, 
    },
  ],
  availabilityStatus: {
    type: String,
    enum: ['available', 'booked', 'pending', 'rejected'],
    default: 'pending'
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  availabiltyDate:{
    type: Date,
    default: Date.now()
  },
  bookmarks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });


roomSchema.
index
({ "location.coordinates": "2dsphere" });


const Room = mongoose.model('Room', roomSchema);
export default Room;
