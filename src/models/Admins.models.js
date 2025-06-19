import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager'],
        required: true
    },
    passkey: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;