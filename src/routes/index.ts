import conversionRoutes from './api/conversion';
import { Router } from 'express';

import notFound from '../middleware/not-found';
import errorHandlerMiddleware from '../middleware/error-handler';

const routes = Router();

routes.get('/', (_req, res) => {
  res.render('pages/index');
});

routes.use('/convert', conversionRoutes);
routes.use(notFound);
routes.use(errorHandlerMiddleware);

export default routes;
