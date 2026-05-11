import { NextFunction, Request, Response } from 'express';
import AppError from '../errorHelpers/AppError';
import envVars from '../../server';
import { ZodError } from 'zod';
import httpStatusCode from 'http-status-codes';

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong`;

  if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
  } else {
    message = error?.message;
  }

  if (error instanceof ZodError) {
    statusCode = httpStatusCode.BAD_REQUEST;
    message = 'Validation Error';
    const formattedError = error?.issues?.reduce(
      (acc, er) => {
        const path = er?.path.join('.');
        acc[path] = er?.message;
        return acc;
      },
      {} as Record<string, any>
    );
    error = formattedError;
  }

  res.status(statusCode).json({
    status: false,
    statusCode,
    message,
    error,
    stack: envVars.NODE_ENV == 'development' ? error?.stack : null,
  });
};
