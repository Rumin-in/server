import { v2 as cloudinary } from "cloudinary";

export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
