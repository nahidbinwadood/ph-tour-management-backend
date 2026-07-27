import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CloudinaryConfig } from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: CloudinaryConfig,
  params: {
    public_id: (req, file) => {
      const originalFileName = file?.originalname
        ?.toLocaleLowerCase()
        .replace(' ', '_')
        .replace(/[^a-z0-9\-.]/g, '')
        .split('.')
        .slice(0, -1)
        .join('_');
      const uniqueName = `${Math.random().toString(36).substring(2)}_${Date.now()}_${originalFileName}`;
      return uniqueName;
    },
  },
});

export const multerUpload = multer({ storage });
