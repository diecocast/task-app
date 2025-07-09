import { useState, useEffect } from 'react';
import { Task, CreateTaskData } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  task?: Task | null;
  loading?: boolean;
}

export const TaskModal = ({ isOpen, onClose, onSubmit, task, loading }: TaskModalProps) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: 'pendiente',
    priority: 'media',
    dueDate: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pendiente',
        priority: 'media',
        dueDate: '',
        tags: [],
      });
    }
    setError(null);
    setValidationErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validar título
    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'El título debe tener al menos 3 caracteres';
    }
    
    // Validar descripción
    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres';
    }
    
    // Validar fecha de vencimiento
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
      
      if (selectedDate < today) {
        errors.dueDate = 'La fecha de vencimiento debe ser futura';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la tarea');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-light text-gray-900">
              {task ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-xl"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  validationErrors.title 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-gray-200 focus:ring-gray-300'
                }`}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                  validationErrors.description 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-gray-200 focus:ring-gray-300'
                }`}
                placeholder="Describe la tarea (mínimo 10 caracteres)"
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.description && (
                  <p className="text-sm text-red-600">{validationErrors.description}</p>
                )}
                <p className={`text-xs ml-auto ${
                  formData.description.length < 10 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {formData.description.length}/10 caracteres mínimos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de vencimiento
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  validationErrors.dueDate 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-gray-200 focus:ring-gray-300'
                }`}
              />
              {validationErrors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Agregar etiqueta"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? 'Guardando...' : (task ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};