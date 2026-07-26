import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CloudinaryConfig } from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: CloudinaryConfig,
  params: {
    // public_id: (req, file) => {},
  },
});

export const multerUpload = multer({ storage });
