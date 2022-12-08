import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

const cache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { filename, width, height } = req.query;
  const type = req.query.type ?? 'jpeg';
  const input = path.join(__dirname, `../images/${filename}.jpeg`);

  if (!['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'].includes(
    ((type as unknown) as string).toLowerCase())) {
      return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Sorry, We don't support the .${type} extension yet`);
  }

  if (!fs.existsSync(input)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Oh ohh, We don't have a pictures of ${filename}`);
  }

  if (!width && !height) {
    res.status(StatusCodes.OK).sendFile(input);
    return;
  }
  
  const converted = path.join(
    __dirname,
    `../images/thumb/${filename}_${width}x${height}.${type}`
  );

  if (fs.existsSync(converted)) {
    res.status(StatusCodes.OK).sendFile(converted);
    return;
  }

  next();
};

export default cache;
