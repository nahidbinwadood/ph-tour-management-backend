/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { existsSync, unlink } from 'fs';
import path from 'path';
import AppError from '../../errorHelpers/AppError';
import { fileDir, fileUp } from '../../utils/saveImage';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';

const router = Router();

// upload file==>
router.post('/upload', async (req: Request, res: Response) => {
  const files = req.files as any;

  if (!files) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Upload the file');
  }

  const asset = files?.file;
  if (!asset) {
    throw new AppError(400, 'Asset is missing');
  }

  const uploadFile = await fileUp(asset?.path);
  return res.status(201).json({ message: 'File uploaded', file: uploadFile });
});

// get file==>
router.get('/:filename', async (req: Request, res: Response) => {
  const filename = req.params.filename;

  if (!filename) {
    throw new AppError(400, 'Filename is missing');
  }

  const filepath = path.join(fileDir, filename);

  if (!existsSync(filepath)) {
    throw new AppError(400, 'File is missing');
  }

  res.set('Cache-Control', 'public, max-age=31557600');
  res.status(200).sendFile(filepath);
});

// delete file==>
router.delete('/:filename', async (req: Request, res: Response) => {
  const filename = req.params.filename;

  if (!filename) {
    throw new AppError(400, 'Filename is missing');
  }

  const filepath = path.join(fileDir, filename);

  if (!existsSync(filepath)) {
    throw new AppError(400, 'File is missing');
  }
  unlink(filepath, (err) => {
    if (err) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete the file');
    }
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'File deleted successfully',
  });
});
export const FileRoutes = router;
