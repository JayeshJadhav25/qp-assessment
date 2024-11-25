import express from 'express';
import { viewGroceryItems, placeOrder } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['user'])); // Only admins can access these routes

router.get('/grocery', viewGroceryItems);
router.post('/order', placeOrder);

export default router;
