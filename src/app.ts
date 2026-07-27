import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import expressSession from 'express-session';
import httpStatusCode from 'http-status-codes';
import passport from 'passport';
import { envVars } from './app/config/env';
import './app/config/passport';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

// parser==>
app.use(cors());
app.disable('x-powered-by')
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// app.use(formData.parse());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
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

// global error==>
app.use(globalErrorHandler);

export default app;
