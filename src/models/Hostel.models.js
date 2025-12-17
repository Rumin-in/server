import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  hostelType: {
    type: String,
    enum: ['Boys', 'Girls', 'Co-ed'],
    required: true
  },
  totalBeds: {
    type: Number,
    required: true
  },
  availableBeds: {
    type: Number,
    required: true
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
  rentPerBed: {
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
    enum: ['available', 'full', 'pending', 'rejected'],
    default: 'pending'
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  availabilityDate: {
    type: Date,
    default: Date.now()
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  feedbacks: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  showReviews: {
    type: Boolean,
    default: false
  },
  adminRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  facilities: {
    food: {
      type: Boolean,
      default: false
    },
    laundry: {
      type: Boolean,
      default: false
    },
    cleaning: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

hostelSchema.index({ "location.coordinates": "2dsphere" });

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;
