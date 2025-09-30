import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { PurchaseController } from '../controllers/purchaseController';

const router = Router();

router.post('/client', ClientController.registerClient);
router.post('/purchase', PurchaseController.processPurchase);

export default router;
