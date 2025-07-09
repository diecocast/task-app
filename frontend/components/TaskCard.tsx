import { Task } from '../types/task';
import { memo, useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export const TaskCard = memo(({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pendiente': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'en progreso': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completada': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'alta': return 'bg-red-50 text-red-700 border-red-200';
      case 'media': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'baja': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'en progreso': return 'En Progreso';
      case 'completada': return 'Completada';
      default: return status;
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return priority;
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    setIsUpdating(true);
    try {
      await onStatusChange(task._id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 ${isUpdating ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex-1 leading-tight">
          {task.title}
        </h3>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
            disabled={isUpdating}
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            disabled={isUpdating}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed">{task.description}</p>

      {/* Status and Priority Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
          {getStatusText(task.status)}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}>
          {getPriorityText(task.priority)}
        </span>
        {task.isOverdue && (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            Vencida
          </span>
        )}
      </div>
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 text-sm flex items-center gap-2">
            📅 Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}

      {/* Status Selector */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent disabled:opacity-50 text-gray-900 transition-all duration-200"
        >
          <option value="pendiente">Pendiente</option>
          <option value="en progreso">En Progreso</option>
          <option value="completada">Completada</option>
        </select>
        {isUpdating && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
            <span className="text-sm">Actualizando...</span>
          </div>
        )}
      </div>

      {/* Created Date */}
      <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
        Creada: {new Date(task.createdAt).toLocaleDateString('es-ES')}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';