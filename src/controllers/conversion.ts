import { Request, Response } from 'express';

const convert = async (req: Request, res: Response): Promise<Response> => {
  const { filename, width, height } = req.query;
  console.log(req.query);
  return res
    .status(200)
    .send(`${filename} has been resized to ${width}x${height}`);
};

export { convert };
