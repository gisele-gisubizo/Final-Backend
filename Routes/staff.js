import express from 'express';
import { getAllStaff, getStaffById, addStaff, updateStaff, deleteStaff } from '../Controllers/staffController.js';
import { protect, authorize } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Admin-only routes
router.get('/', protect, authorize(['admin']), getAllStaff);
router.get('/:id', protect, authorize(['admin']), getStaffById);
router.post('/', protect, authorize(['admin']), addStaff);
router.patch('/:id', protect, authorize(['admin']), updateStaff);
router.delete('/:id', protect, authorize(['admin']), deleteStaff);

export default router;