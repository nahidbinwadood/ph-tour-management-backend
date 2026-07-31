import httpStatusCode from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IDivision } from './division.interface';
import { Division } from './division.model';
import { deleteCloudinaryImage } from '../../config/cloudinary.config';

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
const getSingleDivision = async (slug: string) => {
  const isExist = await Division.findOne({ slug });
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

  const session = await Division.startSession();
  session.startTransaction();
  try {
    const response = await Division.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    if (isExist?.thumbnail) {
      await deleteCloudinaryImage(isExist.thumbnail);
    }
    await session.commitTransaction();
    session.endSession();
    return response;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// delete division==>
const deleteDivision = async (id: string) => {
  const isExist = await Division.findById(id);

  if (!isExist) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Division not found');
  }

  const session = await Division.startSession();
  session.startTransaction();

  try {
    const response = await Division.findByIdAndDelete(id, { session });
    if (isExist?.thumbnail) {
      await deleteCloudinaryImage(isExist?.thumbnail);
    }

    await session.commitTransaction();
    session.endSession();
    return response;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const DivisionServices = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
