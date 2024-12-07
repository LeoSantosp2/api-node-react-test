import { Router } from 'express';

import rentedBooksController from '../controllers/rented-books-controller';

const router = Router();

router.get('/', rentedBooksController.index);
router.get('/:clientId', rentedBooksController.show);
router.post('/', rentedBooksController.store);
router.put('/:id', rentedBooksController.update);

export default router;
