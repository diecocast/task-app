"use client";

import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskStats } from '../components/TaskStats';
import { TaskFilters } from '../components/TaskFilters';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { AISummary } from '../components/AISummary';
import { AITaskCreator } from '../components/AITaskCreator';
import { Task, CreateTaskData } from '../types/task';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function Home() {
  const { tasks, stats, loading, error, filters, setFilters, createTask, updateTask, deleteTask, forceRefresh } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showAITaskCreator, setShowAITaskCreator] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const handleCreateTask = async (data: CreateTaskData) => {
    setModalLoading(true);
    try {
      await createTask(data);
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (data: CreateTaskData) => {
    if (!editingTask) return;
    setModalLoading(true);
    try {
      await updateTask(editingTask._id, data);
      setEditingTask(null);
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Tarea',
      message: '¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await deleteTask(id);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          alert('Error al eliminar la tarea');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      await updateTask(id, { status });
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleAITaskCreated = (task: Task) => {
    forceRefresh();
    setShowAITaskCreator(false);
  };

  const safeTasks = tasks || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                Gestor de Tareas
              </h1>
              <p className="text-xl text-gray-600 font-light">Organiza y gestiona tus tareas de manera eficiente</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAISummary(true)}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                🤖 Resumen IA
              </button>
              <button
                onClick={() => setShowAITaskCreator(true)}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                ✨ Crear con IA
              </button>
              <button
                onClick={forceRefresh}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 font-medium transition-all duration-200 shadow-sm"
              >
                🔄 Actualizar
              </button>
              <button
                onClick={openCreateModal}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium transition-all duration-200 shadow-sm"
              >
                + Nueva Tarea
              </button>
            </div>
          </div>
        </header>

        {/* Stats */}
        <TaskStats stats={stats} loading={loading} />

        {/* Filters */}
        <TaskFilters filters={filters} onFiltersChange={setFilters} />

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Tasks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse shadow-sm">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : safeTasks.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6 opacity-30">📝</div>
            <h3 className="text-2xl font-light text-gray-900 mb-3">No hay tareas</h3>
            <p className="text-gray-600 mb-8 text-lg font-light">Comienza creando tu primera tarea</p>
            <button
              onClick={openCreateModal}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm"
            >
              Crear Tarea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeTasks.map((task) => (
              <TaskCard
                key={`${task._id}-${task.updatedAt}`}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          type="danger"
        />
        {/* Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
          loading={modalLoading}
        />

        {/* AI Summary Modal */}
        {showAISummary && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <AISummary onClose={() => setShowAISummary(false)} />
          </div>
        )}

        {/* AI Task Creator Modal */}
        {showAITaskCreator && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <AITaskCreator 
              onClose={() => setShowAITaskCreator(false)}
              onTaskCreated={handleAITaskCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
}
