import { Router } from 'express';
import { convert } from '../../controllers/conversion';

const conversionRoutes = Router();

conversionRoutes.route('/').get(convert);

export default conversionRoutes;
