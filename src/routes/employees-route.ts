import { Router } from 'express';

import employeesController from '../controllers/employees-controller';

const router = Router();

router.get('/', employeesController.index);
router.post('/', employeesController.store);

export default router;
