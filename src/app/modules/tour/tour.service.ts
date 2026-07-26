import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { Division } from '../division/division.model';
import { tourSearchableFields } from './tour.contant';
import { ITour } from './tour.interface';
import { Tour, TourType } from './tour.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

// ============= Tour Types ================

// create tour type==>
const createTourType = async (payload: { name: string }) => {
  const isExist = await TourType.findOne({ name: payload.name });

  if (isExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This tour type is already exists'
    );
  }

  const response = await TourType.create(payload);

  return response;
};

// get all tour types==>
const getAllTourTypes = async () => {
  const response = await TourType.find({});
  return response;
};

// single tour type==>
const getSingleTourType = async (id: string) => {
  const response = await TourType.findById(id);
  return response;
};

// update tour types==>
const updateTourTypes = async (id: string, payload: { name: string }) => {
  const isExist = await TourType.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour Type not found');
  }

  const duplicateTourTypes = await TourType.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateTourTypes) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'A Tour type with this name is already exists, Please try another name'
    );
  }

  const response = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return response;
};

// delete tour types==>
const deleteTourTypes = async (id: string) => {
  const isExist = await TourType.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour Type not found');
  }

  await TourType.findByIdAndDelete(id);
};

// ============= Tour  ================

// create tour==>
const createTour = async (payload: ITour) => {
  const isExist = await Tour.findOne({ title: payload.title });

  if (isExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This tour title is already exists. Please try another tour title'
    );
  }

  const tourTypeExists = await TourType.findById(payload.tourType);
  if (!tourTypeExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Tour type does not exist. Please provide a valid tour type'
    );
  }

  const divisionExists = await Division.findById(payload.division);
  if (!divisionExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Division does not exist. Please provide a valid division'
    );
  }

  const response = await Tour.create(payload);

  return response;
};

// get all tours==>
const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tour = queryBuilder
    .filter()
    .search(tourSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tour.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// get single tour==>
const getSingleTour = async (slug: string) => {
  const response = await Tour.findOne({ slug });

  return response;
};

// update tour ==>
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isExist = await Tour.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour  not found');
  }

  const duplicateTourTypes = await TourType.findOne({
    name: payload.title,
    _id: { $ne: id },
  });

  if (duplicateTourTypes) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'A Tour type with this name is already exists, Please try another name'
    );
  }

  const tourTypeExists = await TourType.findById(payload.tourType);
  if (!tourTypeExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Tour type does not exist. Please provide a valid tour type'
    );
  }

  const divisionExists = await Division.findById(payload.division);
  if (!divisionExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Division does not exist. Please provide a valid division'
    );
  }

  const response = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return response;
};

// delete tour==>
const deleteTour = async (id: string) => {
  const isExist = await Tour.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour not found');
  }

  await Tour.findByIdAndDelete(id);
};

export const TourServices = {
  createTourType,
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
