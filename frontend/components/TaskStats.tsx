import { TaskStatsResponse } from '../types/task';

interface TaskStatsProps {
  stats: TaskStatsResponse | null;
  loading?: boolean;
}

export const TaskStats = ({ stats, loading }: TaskStatsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse shadow-sm">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const getStatusCount = (status: string): number => {
    const statusItem = stats.byStatus.find(item => item.status === status);
    return statusItem ? statusItem.count : 0;
  };

  const statItems = [
    { 
      label: 'Total', 
      value: stats.total, 
      icon: '📊',
      color: 'text-gray-900'
    },
    { 
      label: 'Pendientes', 
      value: getStatusCount('pendiente'), 
      icon: '📋',
      color: 'text-amber-600'
    },
    { 
      label: 'En Progreso', 
      value: getStatusCount('en progreso'), 
      icon: '⚡',
      color: 'text-blue-600'
    },
    { 
      label: 'Completadas', 
      value: getStatusCount('completada'), 
      icon: '✅',
      color: 'text-green-600'
    },
    { 
      label: 'Vencidas', 
      value: stats.overdue, 
      icon: '⚠️',
      color: 'text-red-600'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
      {statItems.map((item) => (
        <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-3xl font-light ${item.color} group-hover:scale-105 transition-transform duration-200`}>
              {item.value}
            </span>
          </div>
          <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};