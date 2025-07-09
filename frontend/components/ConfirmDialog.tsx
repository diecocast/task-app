import { useState, useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(onConfirm, 150);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onCancel, 150);
  };

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          iconBg: 'bg-yellow-100'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          iconBg: 'bg-blue-100'
        };
      default:
        return {
          icon: '⚠️',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBg: 'bg-red-100'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        <div className="p-8">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center`}>
              <span className="text-2xl">{styles.icon}</span>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
            {title}
          </h3>

          {/* Mensaje */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            {message}
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-6 py-3 text-white rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};