import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DivisionServices } from './division.service';

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const response = await DivisionServices.createDivision(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: 'Division Created Successfully',
    data: response,
  });
});

export const DivisionControllers = {
  createDivision,
};
