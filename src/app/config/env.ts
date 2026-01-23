import dotenv from 'dotenv';

dotenv.config();

interface IEnvConfig {
  PORT: string;
  DB_URL: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production';
}

const loadEnvVariables = (): IEnvConfig => {
  const requiredVariables: string[] = [
    'PORT',
    'DB_URL',
    'JWT_SECRET',
    'NODE_ENV',
  ];

  requiredVariables.forEach((key: string) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  };
};
export const envVars = loadEnvVariables();
