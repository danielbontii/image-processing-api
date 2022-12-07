import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';

const convert = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { filename, width, height } = req.query;
  const input = path.join(__dirname, `../images/${filename}.jpg`);

  if (!fs.existsSync(input)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Oh ohh, We don't have a pictures of ${filename}`);
  }

  if (!width && !height) {
    res.sendFile(input);
    return;
  }

  const outputPath = path.join(
    __dirname,
    `../images/thumb/${filename}_${width}x${height}.png`
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
