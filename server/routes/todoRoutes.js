import express from 'express';
import authProtect from '../middleware/authMiddleware.js';
import {
  createTodo,
  getTodosByCategory,
  getTodoById,
  updateTodo,
  deleteTodo
} from '../controllers/todoController.js';

const router = express.Router({ mergeParams: true });

// GET specific task by ID within a category
router
  .route("/:categoryId/tasks")
  .post(authProtect, createTodo)
  .get(authProtect, getTodosByCategory);

router
  .route("/:categoryId/tasks/:taskId")
  .get(authProtect, getTodoById)
  .patch(authProtect, updateTodo)
  .delete(authProtect, deleteTodo);


export default router;
