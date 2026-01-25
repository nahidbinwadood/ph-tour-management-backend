import { Server } from 'http';

import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

const PORT = envVars.PORT;
const DB_URL = envVars.DB_URL;

const startServer = async () => {
  try {
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
  // await seedSuperAdmin();
})();

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received...Server is shutting down');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received...Server is shutting down');

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandled error==>
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection detected..Server is shutting down', err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// uncaught exception==>
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception detected...Server is shutting down', err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
