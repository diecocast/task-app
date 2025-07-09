import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStatsResponse } from '../types/task';
import { taskService } from '../services/taskService';

export const useTasks = (initialFilters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters || {});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await taskService.getTasks(filters);

      if (response && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tareas');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filters, refreshTrigger]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData:any = await taskService.getTaskStats();
      setStats(statsData.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, [refreshTrigger]);

  // Función para forzar actualización
  const forceRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const createTask = async (data: CreateTaskData) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks(prev => [newTask, ...prev]);
      setTimeout(() => {
        forceRefresh();
      }, 100);
      return newTask;
    } catch (err) {
      forceRefresh();
      throw err;
    }
  };

  const updateTask = async (id: string, data: UpdateTaskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(task => 
        task._id === id ? { ...task, ...updatedTask } : task
      ));
      setTimeout(() => {
        forceRefresh();
      }, 100);
      return updatedTask;
    } catch (err) {
      forceRefresh();
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      setTimeout(() => {
        forceRefresh();
      }, 100);
    } catch (err) {
      forceRefresh();
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    tasks,
    stats,
    loading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
    forceRefresh,
  };
};