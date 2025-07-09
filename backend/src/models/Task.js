const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: {
      values: ['pendiente', 'en progreso', 'completada'],
      message: 'El estado debe ser: pendiente, en progreso o completada'
    },
    default: 'pendiente'
  },
  priority: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'La fecha de vencimiento debe ser futura'
    }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar rendimiento
taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text' });

// Virtual para verificar si la tarea está vencida
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'completada';
});

// Middleware pre-save
taskSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);