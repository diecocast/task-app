const { body } = require('express-validator');

// Validador para crear tarea desde mensaje
const createTaskFromMessageValidator = [
  body('message')
    .notEmpty()
    .withMessage('El mensaje es requerido')
    .isLength({ min: 10, max: 1000 })
    .withMessage('El mensaje debe tener entre 10 y 1000 caracteres')
    .trim()
];

module.exports = {
  createTaskFromMessageValidator
};