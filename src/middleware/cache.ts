import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

const cache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const {  width, height } = req.query;
  const filename = req.query.filename ?? 'default';
  const output = req.query.output ?? 'jpeg';
  const input = req.query.input ?? 'jpeg';
  let inputPath: string = path.join(
    __dirname,
    `../images/${filename}.${input}`
  );

  const formats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];
  
  if (
    !formats.includes((output as string).toLowerCase()) ||
    !formats.includes((input as string).toLowerCase())
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Sorry, We don't support the .${output} extension yet`);
  }

  if (!fs.existsSync(inputPath)) {
    inputPath = path.join(__dirname, `../images/${filename}.jpeg`);
  }

  if (!fs.existsSync(inputPath)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Oh ohh, We don't have a pictures of ${filename}`);
  }

  if (!width && !height) {
    res.status(StatusCodes.OK).sendFile(inputPath);
    return;
  }

  const converted = path.join(
    __dirname,
    `../images/thumb/${filename}_${width}x${height}.${output}`
  );

  if (fs.existsSync(converted)) {
    res.status(StatusCodes.OK).sendFile(converted);
    return;
  }

  next();
};

export default cache;
