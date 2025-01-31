import { Router } from 'express';

import clientsController from '../controllers/clients-controller';

const router = Router();

router.get('/?', clientsController.index);
router.get('/:id', clientsController.show);
router.post('/', clientsController.store);
router.put('/:id', clientsController.update);
router.delete('/:id', clientsController.delete);

export default router;
