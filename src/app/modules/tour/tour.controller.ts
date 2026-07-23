import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TourServices } from './tour.service';

// ============= Tour Types ================

// create tour types==>
const createTourTypes = catchAsync(async (req: Request, res: Response) => {
  const response = await TourServices.createTourType(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour type created successfully',
    data: response,
  });
});

// all tour types==>
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const response = await TourServices.getAllTourTypes();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour types data fetched successfully',
    data: response,
  });
});

// update tour types==>
const updateTourTypes = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const response = await TourServices.updateTourTypes(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour type updated successfully',
    data: response,
  });
});

// delete tour types==>
const deleteTourTypes = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await TourServices.deleteTourTypes(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour type deleted successfully',
  });
});

// ============= Tour ================

export const TourControllers = {
  createTourTypes,
  getAllTourTypes,
  updateTourTypes,
  deleteTourTypes,
};
