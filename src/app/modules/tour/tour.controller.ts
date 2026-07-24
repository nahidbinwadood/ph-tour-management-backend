import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TourServices } from './tour.service';
import AppError from '../../errorHelpers/AppError';

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

// single tour type==>
const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour type is missing');
  }
  const response = await TourServices.getSingleTourType(id);

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

  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Tour type id is missing');
  }

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

// create tour==>
const createTour = catchAsync(async (req: Request, res: Response) => {
  const response = await TourServices.createTour(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour created successfully',
    data: response,
  });
});

// get all tours==>
const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query || '';

  const response = await TourServices.getAllTours(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All tours data fetched successfully',
    data: response,
  });
});

// get single tour==>
const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  if (!slug) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slug is missing');
  }

  const response = await TourServices.getSingleTour(slug);

  if (!response) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid slug provided');
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour data fetched successfully',
    data: response,
  });
});

// update tour==>
const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Tour id is missing');
  }

  const response = await TourServices.updateTour(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour updated successfully',
    data: response,
  });
});

// delete tour==>
const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await TourServices.deleteTour(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour deleted successfully',
  });
});

export const TourControllers = {
  createTourTypes,
  getAllTourTypes,
  getSingleTourType,
  updateTourTypes,
  deleteTourTypes,
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
