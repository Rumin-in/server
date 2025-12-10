import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load env vars - needed because ES module imports are hoisted
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
