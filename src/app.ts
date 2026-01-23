import express, { Application, NextFunction, Request, Response } from 'express';
import router from './app/routes';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import httpStatusCode from 'http-status-codes';

const app: Application = express();

// parser==>
app.use(cors());
app.use(express.json());

// routes==>
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res
    .status(httpStatusCode.OK)
    .json({
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'The server is running',
    });
});

// global error==>
app.use(globalErrorHandler);

// not found error==>
app.use(notFound);
export default app;
