import { Router } from 'express';

import booksCopyController from '../controllers/books-copy-controller';

const router = Router();

router.get('/:bookId', booksCopyController.index);
router.post('/:bookId', booksCopyController.store);
router.put('/:copyCode', booksCopyController.update);
router.delete('/:copyCode', booksCopyController.delete);

export default router;
