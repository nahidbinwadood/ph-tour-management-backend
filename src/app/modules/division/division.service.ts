import httpStatusCode from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IDivision } from './division.interface';
import { Division } from './division.model';

// create division==>
const createDivision = async (payload: IDivision) => {
  const isAlreadyExist = await Division.findOne({ name: payload.name });

  if (isAlreadyExist) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'A division with this name is already exists'
    );
  }

  const response = await Division.create(payload);
  return response;
};

// get all divisions==>
const getAllDivisions = async () => {
  const response = await Division.find({});
  return response;
};

// get single division==>
const getSingleDivision = async (id: string) => {
  const isExist = await Division.findById(id);
  if (!isExist) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Division not found');
  }
  return isExist;
};

// update division==>
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isExist = await Division.findById(id);

  if (!isExist) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Division not found');
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'A division with this name is already exists'
    );
  }

  const response = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return response;
};

// delete division==>
const deleteDivision = async (id: string) => {
  const isExist = await Division.findById(id);

  if (!isExist) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Division not found');
  }

  const response = await Division.findByIdAndDelete(id);
  return response;
};

export const DivisionServices = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
