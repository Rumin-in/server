import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    issueDescription: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;