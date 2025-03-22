import { Router } from 'express';

import reportsController from '../controllers/reports-controller';

const router = Router();

router.get('/?', reportsController.index);
router.get('/cities', reportsController.show);

export default router;
