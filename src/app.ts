import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import cors from 'cors';
import routes from './routes';
import AppError from './errors/AppError';

import createConnection from './database';

createConnection();
const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    console.log('Ewwwww');
    // If it's error from application
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // Getting unexpected error
    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

export default app;
