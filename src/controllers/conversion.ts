import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

const convert = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { filename, width, height } = req.query;
  const output = req.query.output ?? 'jpeg';
  const input = req.query.input ?? 'jpeg';
 
  let inputPath:string = path.join(__dirname, `../images/${filename}.${input}`);

  const outputPath = path.join(
    __dirname,
    `../images/thumb/${filename}_${width}x${height}.${output}`
  );

  await sharp(inputPath)
    .resize(parseInt(width as string), parseInt(height as string), {
      kernel: sharp.kernel.nearest,
      fit: 'cover'
    })
    .toFile(outputPath);
  res.status(StatusCodes.OK).sendFile(outputPath);
};

export { convert };
