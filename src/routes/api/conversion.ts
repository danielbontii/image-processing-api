import { Router } from 'express';
import { convert } from '../../controllers/conversion';
import cache from '../../middleware/cache';

const conversionRoutes = Router();

conversionRoutes.route('/').get(cache, convert);

export default conversionRoutes;
