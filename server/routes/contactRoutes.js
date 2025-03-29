import express from 'express';
import { submitContact, getContacts, markAsRead } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', submitContact);

// Protected routes
router.get('/', protect, admin, getContacts);
router.put('/:id', protect, admin, markAsRead);

export default router;