/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';
import { IErrorSource } from '../interface/error.type';
import { deleteCloudinaryImage } from '../config/cloudinary.config';

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong`;

  let errorSources: IErrorSource[] = [];

  // delete from the cloudinary if any error occurs(Single)==>
  if (req.file) {
    await deleteCloudinaryImage(req.file.path);
  }

  // delete from the cloudinary if any error occurs(Multiple)==>
  if (req.files && Array.isArray(req.files) && !!req.files.length) {
    await Promise.all(
      req.files.map((item) => deleteCloudinaryImage(item?.path))
    );
  }

  switch (true) {
    // App Error==>
    case error instanceof AppError: {
      statusCode = error.statusCode;
      message = error?.message;
      break;
    }

    // Mongoose errors (duplicate)==>
    case error?.code === 11000: {
      const duplicateValue = Object.values(error?.keyValue)[0];
      statusCode = httpStatusCode.BAD_REQUEST;
      message = `${duplicateValue} already exists`;
      break;
    }

    // Object ID error Id error (Cast Error)=>
    case error?.name === 'CastError': {
      statusCode = httpStatusCode.BAD_REQUEST;
      message = 'Invalid MongoDB ObjectID. Please provide a valid id';
      break;
    }

    // Mongoose Validation Error=>
    case error?.name === 'ValidationError': {
      const err = Object.values(error?.errors);
      const errItems: IErrorSource[] = [];
      err?.forEach((item: any) =>
        errItems?.push({
          path: item?.path,
          message: item?.message,
        })
      );
      errorSources = errItems;
      statusCode = httpStatusCode.BAD_REQUEST;
      message = 'Validation Error';
      break;
    }

    // Zod Validation error==>
    case error?.name === 'ZodError': {
      const errItems: IErrorSource[] = [];
      error?.issues?.forEach((issue: any) =>
        errItems?.push({
          path: issue?.path[issue.path.length - 1],
          message: issue?.message,
        })
      );

      statusCode = httpStatusCode.BAD_REQUEST;
      message = 'Zod Error';
      errorSources = errItems;
      break;
    }

    // ========= JWT ERROR(Token Expiration)=============
    case error instanceof jwt.TokenExpiredError: {
      statusCode = httpStatusCode.UNAUTHORIZED;
      message = 'Session has expired. Please login again';
      break;
    }

    // ========= JWT ERROR(Invalid Token)=============
    case error instanceof jwt.JsonWebTokenError: {
      statusCode = httpStatusCode.UNAUTHORIZED;
      message = 'Invalid token. Please login again.';
      break;
    }

    case error instanceof Error: {
      statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
      message = error.message || 'Internal Server Error';
      console.log('✓ Handled as Generic Error');
      break;
    }
  }

  res.status(statusCode).json({
    status: false,
    statusCode,
    message,
    ...(envVars.NODE_ENV == 'development' && !!errorSources?.length
      ? { errorSources }
      : {}),
    ...(envVars.NODE_ENV == 'development' ? { error } : {}),
    ...(envVars.NODE_ENV == 'development' ? { stack: error?.stack } : {}),
  });
};
