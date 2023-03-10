import { CustomError } from '../errors';
import { StatusCodes } from 'http-status-codes';

import { Request, Response, NextFunction } from 'express';

const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .render('pages/info', { message: err.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/info', {
    message: 'Something went wrong. Please try again later'
  });
};

export default errorHandlerMiddleware;
