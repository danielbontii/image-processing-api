import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

const convert = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { filename, width, height} = req.query;
  const output = req.query.output ?? 'jpeg';
  const input = req.query.input ?? 'jpeg';

  const conversionWidth = isNaN(parseInt(width as string)) ? undefined : parseInt(width as string);
  const conversionHeight = isNaN(parseInt(height as string)) ? undefined : parseInt(height as string);
 
  let inputPath:string = path.join(__dirname, `../images/${filename}.${input}`);

  const outputPath = path.join(
    __dirname,
    `../images/thumb/${filename}_${conversionWidth ?? 'auto'}x${conversionHeight ?? 'auto'}.${output}`
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
