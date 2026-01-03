import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import cors from 'cors';

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

export default app;
