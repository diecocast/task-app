export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pendiente' | 'en progreso' | 'completada';
  priority: 'baja' | 'media' | 'alta';
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: 'pendiente' | 'en progreso' | 'completada';
  priority?: 'baja' | 'media' | 'alta';
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Nueva estructura de estadísticas
export interface TaskStatsResponse {
  total: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byPriority: Array<{
    _id: string;
    count: number;
  }>;
  overdue: number;
}

// Mantener la interfaz original para compatibilidad
export interface TaskStats {
  total: number;
  pendiente: number;
  inProgress: number;
  completada: number;
  overdue: number;
}