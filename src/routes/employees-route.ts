import { Router } from 'express';

import employeesController from '../controllers/employees-controller';

const router = Router();

router.get('/', employeesController.index);
router.get('/:id', employeesController.show);
router.post('/', employeesController.store);
router.put('/:id', employeesController.update);
router.delete('/:id', employeesController.delete);

export default router;
