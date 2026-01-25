import { NextFunction, Request, Response } from 'express';
import zod, { ZodObject } from 'zod';

const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = await zodSchema.parseAsync(req.body);
    next();
  };

export default validateRequest;
