// routes/categoryRoutes.js
import express from 'express';
import authProtect from '../middleware/authMiddleware.js';
import {
  createCategory,
  getUserCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post('/', authProtect, createCategory);
router.get('/', authProtect, getUserCategories);
router.get('/:categoryId', authProtect, getCategoryById);
router.patch('/:categoryId', authProtect, updateCategory);
router.delete('/:categoryId', authProtect, deleteCategory);

export default router;
