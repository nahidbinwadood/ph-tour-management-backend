import { Server } from 'http';

import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';

let server: Server;

const PORT = envVars.PORT;
const DB_URL=envVars.DB_URL


const startServer = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to db');
    server = app.listen(PORT, () => {
      console.log(`Server is listening to ${PORT} port`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
