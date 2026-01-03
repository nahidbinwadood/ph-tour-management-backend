import { Response } from 'express';
interface IResponseData<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  token?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
  const { statusCode, success,message , data, token, meta } = responseData;
  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    token,
    meta,
  });
};
export default sendResponse;
