import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

const convert = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { filename, width, height } = req.query;
  const input = path.join(__dirname, `../images/${filename}.jpg`);

  const outputPath = path.join(
    __dirname,
    `../images/thumb/${filename}_${width}x${height}.jpg`
  );

  await sharp(input)
    .resize(parseInt(width as string), parseInt(height as string), {
      kernel: sharp.kernel.nearest,
      fit: 'cover'
    })
    .toFile(outputPath);
  res.status(StatusCodes.OK).sendFile(outputPath);
};

export { convert };
