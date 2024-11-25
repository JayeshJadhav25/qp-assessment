import { Router } from 'express';
import {
  addGroceryItem,
  getGroceryItems,
  updateGroceryItem,
  deleteGroceryItem,
  manageInventory
} from '../controllers/adminController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin'])); // Only admins can access these routes
// 
router.post('/grocery', addGroceryItem);
router.get('/groceries', getGroceryItems);
router.put('/grocery/:id', updateGroceryItem);
router.delete('/grocery/:id', deleteGroceryItem);
router.put('/inventory', manageInventory);


export default router;
