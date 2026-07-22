import httpStatusCode from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IDivision } from './division.interface';
import { Division } from './division.model';

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

export const DivisionServices = {
  createDivision,
};
