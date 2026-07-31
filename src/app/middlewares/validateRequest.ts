import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { ZodObject } from 'zod';
import sendResponse from '../utils/sendResponse';

const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    // send error if the request body is empty==>
    if (!req.body || Object.keys(req.body).length === 0) {
      sendResponse(res, {
        success: false,
        statusCode: httpStatusCode.BAD_REQUEST,
        message: 'Request body is empty',
      });
    }

    req.body = await zodSchema.parseAsync(req.body);
    next();
  };

export default validateRequest;
