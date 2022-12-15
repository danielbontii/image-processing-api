import conversionRoutes from './api/conversion';
import notFound from '../middleware/not-found';
import { Router } from 'express';


const routes = Router();

routes.get('/', (_req, res) => {
    res.render('pages/index');
})

routes.use('/convert', conversionRoutes);
routes.use(notFound);

export default routes;
