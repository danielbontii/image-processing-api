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
  const input = path.join(__dirname, `../images/${filename}.jpg`);

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
    `../images/thumb/${filename}_${width}x${height}.jpg`
  );


  if (fs.existsSync(converted)) {
    res.status(StatusCodes.OK).sendFile(converted);
    return;
  }

  next();
};

export default cache;
