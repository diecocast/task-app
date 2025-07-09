const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Obtener todas las tareas con filtros y paginación
const getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Ejecutar consulta
    const tasks = await Task.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filters);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTasks: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    });
  }
};

// Obtener una tarea por ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
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

    const task = new Task(req.body);
    const savedTask = await task.save();

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: savedTask
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
};

// Actualizar una tarea
const updateTask = async (req, res) => {
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

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: task
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: task
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    });
  }
};

// Obtener estadísticas de tareas
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          statusCounts: {
            $push: {
              status: '$_id',
              count: '$count'
            }
          }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'completada' }
    });

    res.status(200).json({
      success: true,
      data: {
        total: stats[0]?.total || 0,
        byStatus: stats[0]?.statusCounts || [],
        byPriority: priorityStats,
        overdue: overdueTasks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};