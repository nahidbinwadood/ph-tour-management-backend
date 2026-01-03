import express, { Application, NextFunction, Request, Response } from 'express';
import router from './app/routes';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// parser==>
app.use(cors());
app.use(express.json());

// routes==>
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'App is running',
  });
});

// global error==>
app.use(globalErrorHandler);


// not found error==>
app.use(notFound)
export default app;
