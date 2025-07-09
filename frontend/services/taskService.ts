import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStatsResponse } from '../types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class TaskService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    return response.json();
  }

  async getTasks(filters?: TaskFilters): Promise<{ tasks: Task[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return this.request<{ tasks: Task[]; pagination: any }>(endpoint);
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTaskStats(): Promise<TaskStatsResponse> {
    return this.request<TaskStatsResponse>('/tasks/stats');
  }

  // Nuevos métodos para IA
  async generateTasksSummary(): Promise<{ success: boolean; summary: string; generatedAt: string }> {
    return this.request<{ success: boolean; summary: string; generatedAt: string }>('/ai/summary');
  }

  async createTaskFromMessage(message: string): Promise<{ success: boolean; message: string; task: Task; originalMessage: string }> {
    return this.request<{ success: boolean; message: string; task: Task; originalMessage: string }>('/ai/create-task', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const taskService = new TaskService();