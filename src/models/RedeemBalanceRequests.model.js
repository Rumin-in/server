import mongoose from 'mongoose';

const RedeemBalanceRequestSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const RedeemBalanceRequest = mongoose.model('RedeemBalanceRequest', RedeemBalanceRequestSchema);
export default RedeemBalanceRequest;