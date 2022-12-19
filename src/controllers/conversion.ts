import { Request, Response, NextFunction } from 'express';
import convertsion from '../services/conversion';

import { StatusCodes } from 'http-status-codes';

const convert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const convertedImgPath = await convertsion.convert(
      req.filename,
      req.conversionWidth,
      req.conversionHeight,
      req.output as string,
      req.input as string
    );
    res.status(StatusCodes.OK).sendFile(convertedImgPath);
  } catch (error) {
    next(new Error());
  }
};

export { convert };
