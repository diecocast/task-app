"use client";

import { useState } from 'react';
import { taskService } from '../services/taskService';

interface AISummaryProps {
  onClose: () => void;
}

export function AISummary({ onClose }: AISummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [generatedAt, setGeneratedAt] = useState<string>('');

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response:any = await taskService.generateTasksSummary();
      if (response.data.success) {
        setSummary(response.data.summary);
        setGeneratedAt(response.data.generatedAt);
      } else {
        setError('No se pudo generar el resumen');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar resumen');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTextWithBold = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-6 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-900">
                Resumen Inteligente
              </h2>
              <p className="text-gray-600">
                Análisis IA de tus tareas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!summary && !loading && (
          <div className="text-center py-16 px-8 flex-1 flex flex-col justify-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-4xl mb-8">
              🧠
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              Genera un resumen inteligente
            </h3>
            <p className="text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed">
              La IA analizará todas tus tareas y te dará un resumen personalizado con insights y recomendaciones.
            </p>
            <button
              onClick={generateSummary}
              disabled={loading}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mx-auto"
            >
              {loading ? 'Generando...' : 'Generar Resumen'}
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 px-8 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-8"></div>
            <p className="text-gray-900 text-lg font-medium mb-2">La IA está analizando tus tareas...</p>
            <p className="text-gray-600">Esto puede tomar unos segundos</p>
          </div>
        )}

        {error && (
          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto w-full">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <h3 className="text-red-800 font-medium text-lg">Error al generar resumen</h3>
              </div>
              <div className="text-red-700 mb-6">{error}</div>
              <button
                onClick={generateSummary}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium transition-all duration-200"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {summary && (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-xl">Resumen Generado por IA</h3>
                </div>
                
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {summary.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                        {formatTextWithBold(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              {generatedAt && (
                <div className="text-center mt-6 pb-6">
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm border border-gray-200">
                    Generado el {formatDate(generatedAt)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 p-6 flex-shrink-0">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={generateSummary}
                  disabled={loading}
                  className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 font-medium transition-all duration-200"
                >
                  Regenerar
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-medium transition-all duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}