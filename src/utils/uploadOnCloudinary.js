import cloudinary from '../config/cloudinary.js';
import fs from 'fs';


export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); 

    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
