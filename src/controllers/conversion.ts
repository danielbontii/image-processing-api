import { Request, Response } from 'express';
import convertsion from '../services/conversion';

import { StatusCodes } from 'http-status-codes';

const convert = async (
  req: Request,
  res: Response
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/error');
  }
};

export { convert };
