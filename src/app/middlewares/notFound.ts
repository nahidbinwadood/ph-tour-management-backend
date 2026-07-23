import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import sendResponse from '../utils/sendResponse';
const notFound = (req: Request, res: Response) => {
  sendResponse(res, {
    success: false,
    statusCode: httpStatusCode.NOT_FOUND,
    message: 'Route Not Found',
  });
};

export default notFound;
