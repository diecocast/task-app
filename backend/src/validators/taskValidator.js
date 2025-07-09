const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['pendiente', 'en progreso', 'completada'])
    .withMessage('El estado debe ser: pendiente, en progreso o completada'),
  
  body('priority')
    .optional()
    .isIn(['baja', 'media', 'alta'])
    .withMessage('La prioridad debe ser: baja, media o alta'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener formato válido')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('La fecha de vencimiento debe ser futura');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('No se pueden agregar más de 10 etiquetas');
      }
      return true;
    })
];

const updateTaskValidator = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['pendiente', 'en progreso', 'completada'])
    .withMessage('El estado debe ser: pendiente, en progreso o completada'),
  
  body('priority')
    .optional()
    .isIn(['baja', 'media', 'alta'])
    .withMessage('La prioridad debe ser: baja, media o alta'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener formato válido')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('La fecha de vencimiento debe ser futura');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('No se pueden agregar más de 10 etiquetas');
      }
      return true;
    })
];

module.exports = {
  createTaskValidator,
  updateTaskValidator
};