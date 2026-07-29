import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DivisionServices } from './division.service';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';

// create division==>
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

// get all division==>
const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const response = await DivisionServices.getAllDivisions();
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'Divisions data fetched successfully',
    data: response,
  });
});

// get single division==>
const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (!slug) {
    throw new AppError(httpStatus.NOT_FOUND, 'Division slug is missing');
  }
  const response = await DivisionServices.getSingleDivision(slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: 'Division data fetched Successfully',
    data: response,
  });
});

// update division==>
const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;

  const response = await DivisionServices.updateDivision(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: 'Division updated Successfully',
    data: response,
  });
});

// delete division==>
const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  await DivisionServices.deleteDivision(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: 'Division deleted Successfully',
  });
});

export const DivisionControllers = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
