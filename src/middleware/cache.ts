import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '../errors';

const validateDimensions = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { width, height } = req.query;

  const acceptedDimensions: [undefined, string] = [undefined, 'auto'];

  if (
    (!acceptedDimensions.includes(width as string | undefined) &&
      isNaN(parseInt(width as string))) ||
    (!acceptedDimensions.includes(height as string | undefined) &&
      isNaN(parseInt(height as string)))
  ) {
    next(
      new BadRequestError(
        'Please ensure height and width are valid or not specified at all'
      )
    );
  }

  next();
};

const validateFormat = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const output = req.query.output ?? 'jpeg';
  const input = req.query.input ?? 'jpeg';

  const formats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];

  if (
    !formats.includes((output as string).toLowerCase()) ||
    !formats.includes((input as string).toLowerCase())
  ) {
    if (formats.includes((output as string).toLowerCase())) {
      next(
        new BadRequestError(
          `Sorry, we don't support ${req.query.input} extension yet`
        )
      );
    } else {
      next(
        new BadRequestError(
          `Sorry, we don't support ${req.query.output} extension yet`
        )
      );
    }
  }

  next();
};

const lookup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { width, height } = req.query;

  const filename = req.query.filename ?? 'default';
  const output = req.query.output ?? 'jpeg';
  const input = req.query.input ?? 'jpeg';

  let inputPath: string = path.join(
    __dirname,
    `../images/${filename}.${input}er`
  );

  if (!fs.existsSync(inputPath)) {
    inputPath = path.join(__dirname, `../images/${filename}.jpeg`);
  }

  if (!fs.existsSync(inputPath)) {
    next(
      new BadRequestError(
        `Sorry, we don't have any ${input} images of ${filename}`
      )
    );
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

  req.filename = filename as string;
  req.output = output as string;
  req.input = input as string;
  req.conversionWidth = isNaN(parseInt(width as string))
    ? undefined
    : parseInt(width as string);
  req.conversionHeight = isNaN(parseInt(height as string))
    ? undefined
    : parseInt(height as string);

  next();
};

export default { validateDimensions, validateFormat, lookup };
