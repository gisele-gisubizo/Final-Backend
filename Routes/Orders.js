import express from 'express';
import { 
  createOrder, 
  getOrdersByUser, 
  confirmOrder, 
  sendToKitchen, 
  getOrderById, 
  getFavorites, 
  getCurrentOrders, 
  removeFromFavorites, 
  removeFromCurrentOrders, 
  sendPrepTimeMessage, 
  sendKitchenMessage 
} from '../Controllers/OrderController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to ALL order routes
router.post('/', protect, createOrder); // Save cart items as orders
router.get('/favorites', protect, getFavorites);
router.get('/current', protect, getCurrentOrders);
router.get('/user/:userId', protect, getOrdersByUser);
router.get('/:orderId', protect, getOrderById);
router.put('/confirm/:orderId', protect, confirmOrder);
router.put('/kitchen/:orderId', protect, sendToKitchen);
router.delete('/favorites/:id', protect, removeFromFavorites);
router.delete('/current/:id', protect, removeFromCurrentOrders);
router.post('/message/:id', protect, sendPrepTimeMessage);
router.post('/kitchen-message/:id', protect, sendKitchenMessage);

export default router;