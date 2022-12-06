import { Router, Request, Response } from 'express';

const conversionRoutes = Router();

conversionRoutes.get('/', async (req:Request, res:Response) => {
    const {filename, width, height} = req.query;
    console.log(req.query);
  res.status(200).send(`${filename} has been resized to ${width}x${height}`);
});

export default conversionRoutes;
