"use client";

import { useState } from 'react';
import { taskService } from '../services/taskService';
import { Task } from '../types/task';

interface AITaskCreatorProps {
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

export function AITaskCreator({ onClose, onTaskCreated }: AITaskCreatorProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdTask, setCreatedTask] = useState<Task | null>(null);

  const createTaskFromMessage = async () => {
    if (!message.trim()) {
      setError('Por favor, escribe un mensaje');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response:any = await taskService.createTaskFromMessage(message.trim());
      if (response.data.task) {
        setCreatedTask(response.data.task);
        onTaskCreated(response.data.task);
      } else {
        setError('No se pudo crear la tarea desde el mensaje');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      createTaskFromMessage();
    }
  };

  const resetForm = () => {
    setMessage('');
    setCreatedTask(null);
    setError('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-50 text-red-700 border-red-200';
      case 'media': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'baja': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada': return 'bg-green-50 text-green-700 border-green-200';
      case 'en progreso': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pendiente': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h2 className="text-2xl font-light text-gray-900">
              Crear Tarea con IA
            </h2>
            <p className="text-gray-600">Describe tu tarea y la IA la organizará</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <span className="text-xl">×</span>
        </button>
      </div>

      {!createdTask ? (
        <div className="space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-3">
              Describe lo que necesitas hacer
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ejemplo: Necesito preparar la presentación para la reunión del viernes sobre el proyecto de marketing digital. Es importante y debe estar lista antes del jueves."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 leading-relaxed transition-all duration-200"
              rows={5}
              disabled={loading}
            />
            <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
              <span>💡</span>
              <span>Tip: Menciona fechas, prioridad y detalles para mejores resultados. Presiona Ctrl+Enter para crear.</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600">⚠️</span>
                </div>
                <div className="text-red-700 font-medium">{error}</div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={createTaskFromMessage}
              disabled={loading || !message.trim()}
              className="bg-gray-900 text-white px-8 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creando...
                </>
              ) : (
                <>Crear Tarea</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <h3 className="font-medium text-green-900 text-lg">¡Tarea creada exitosamente!</h3>
            </div>
            <p className="text-green-700">La IA ha analizado tu mensaje y creado la siguiente tarea:</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 text-xl mb-2">{createdTask.title}</h4>
                <p className="text-gray-600 leading-relaxed">{createdTask.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(createdTask.status)}`}>
                  {createdTask.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(createdTask.priority)}`}>
                  Prioridad {createdTask.priority}
                </span>
                {createdTask.dueDate && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    📅 {new Date(createdTask.dueDate).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
              
              {createdTask.tags && createdTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {createdTask.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <button
              onClick={resetForm}
              className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-200"
            >
              Crear Otra Tarea
            </button>
            <button
              onClick={onClose}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-medium transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}