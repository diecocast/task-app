const geminiService = require('../services/geminiService');
const { validationResult } = require('express-validator');

// Generar resumen de tareas con IA
const generateTasksSummary = async (req, res) => {
  try {
    const summary = await geminiService.generateTasksSummary();
    
    res.status(200).json({
      success: true,
      message: 'Resumen generado exitosamente',
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar resumen con IA',
      error: error.message
    });
  }
};

// Crear tarea desde mensaje de texto
const createTaskFromMessage = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede estar vacío'
      });
    }

    const result = await geminiService.createTaskFromMessage(message);
    
    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        task: result.task,
        originalMessage: result.originalMessage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea desde mensaje',
      error: error.message
    });
  }
};

module.exports = {
  generateTasksSummary,
  createTaskFromMessage
};