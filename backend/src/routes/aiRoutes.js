const express = require('express');
const router = express.Router();
const {
  generateTasksSummary,
  createTaskFromMessage
} = require('../controllers/aiController');
const {
  createTaskFromMessageValidator
} = require('../validators/aiValidator');

// Rutas de IA
router.get('/summary', generateTasksSummary);
router.post('/create-task', createTaskFromMessageValidator, createTaskFromMessage);

module.exports = router;