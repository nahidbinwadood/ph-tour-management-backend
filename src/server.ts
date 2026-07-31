import { Server } from 'http';

import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { connectRedis } from './app/config/redis.config';

let server: Server;

const startServer = async () => {
  try {
    const PORT = envVars.PORT;
    const DB_URL = envVars.DB_URL;

    console.info('🔄 Initializing server...');
    await mongoose.connect(DB_URL);
    console.info('✅ Database connection established successfully');
    server = app.listen(PORT, () => {
      console.info(`🚀 Server started successfully`);
      console.info(`📡 Listening on port: ${PORT}`);
      console.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server');
    console.error(error);
    process.exit(1);
  }
};

(async () => {
  await startServer();
  await connectRedis();
  // await seedSuperAdmin();
})();

// graceful shutdown: close server, then exit clean==>
const gracefulShutdown = (signal: string) => {
  console.log(`${signal} signal received...Server is shutting down`);
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// unhandled error / uncaught exception: log and exit(1), let supervisor restart==>
// ponytail: no in-process restart — state is corrupt after uncaughtException; pm2/docker restarts cleanly
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection detected, shutting down', reason);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception detected, shutting down', error);
  process.exit(1);
});
