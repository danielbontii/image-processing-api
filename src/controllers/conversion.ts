import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

const convert = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const filename = req.filename ?? 'default';
  const conversionWidth = req.conversionWidth;
  const conversionHeight = req.conversionHeight;

  const inputPath: string = path.join(
    __dirname,
    `../images/${filename}.${req.input}`
  );

  const outputPath = path.join(
    __dirname,
    `../images/thumb/${req.filename}_${conversionWidth ?? 'auto'}x${
      conversionHeight ?? 'auto'
    }.${req.output}`
  );

  await sharp(inputPath)
    .resize(conversionWidth, conversionHeight, {
      kernel: sharp.kernel.nearest,
      fit: 'cover'
    })
    .toFile(outputPath);
  res.status(StatusCodes.OK).sendFile(outputPath);
};

export { convert };
