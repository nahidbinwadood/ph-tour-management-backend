import AppError from '../../errorHelpers/AppError';
import { TourType } from './tour.model';
import httpStatus from 'http-status-codes';

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


export const TourServices = {
  createTourType,
  getAllTourTypes,
  updateTourTypes,
  deleteTourTypes,
};
