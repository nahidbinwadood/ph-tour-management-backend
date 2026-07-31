/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './env';
import AppError from '../errorHelpers/AppError';
import httpStatus from 'http-status-codes';

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryImage = async (imageUrl: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = imageUrl.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`Deleted ${public_id} image from cloudinary `);
    }
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Failed to delete from cloudinary'
    );
  }
};

export const CloudinaryConfig = cloudinary;
