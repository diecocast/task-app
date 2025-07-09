const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const {
  createTaskValidator,
  updateTaskValidator
} = require('../validators/taskValidator');

// Rutas para tareas
router.get('/', getAllTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.post('/', createTaskValidator, createTask);
router.put('/:id', updateTaskValidator, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;