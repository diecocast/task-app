import { TaskFilters as TaskFiltersType } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
}

export const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const handleFilterChange = (key: keyof TaskFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12 shadow-sm">
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Filtros de Búsqueda
        </h3>
        <p className="text-gray-600">Encuentra exactamente lo que buscas</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-gray-700 font-medium mb-3 text-sm uppercase tracking-wide">
            Buscar Tareas
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Escribe para buscar..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
        
        {/* Status Filter */}
        <div>
          <label className="block text-gray-700 font-medium mb-3 text-sm uppercase tracking-wide">
            Estado
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-gray-700 font-medium mb-3 text-sm uppercase tracking-wide">
            Prioridad
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 transition-all duration-200"
          >
            <option value="">Todas las prioridades</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>
      
      {/* Clear Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={clearFilters}
          className="px-6 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};