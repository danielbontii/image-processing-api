import conversionRoutes from "./api/conversion";
import { Router } from 'express';

const routes = Router();

routes.use('/convert', conversionRoutes)

export default routes;