import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

// parser==>
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes==>
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(httpStatusCode.OK).json({
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'The server is running',
  });
});

// not found error==>
app.use(notFound);
export default app;

// global error==>
app.use(globalErrorHandler);
