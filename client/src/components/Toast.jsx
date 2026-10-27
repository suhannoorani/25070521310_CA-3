import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-slate-900/95 text-emerald-200',
    error: 'border-rose-500/30 bg-slate-900/95 text-rose-200',
    info: 'border-indigo-500/30 bg-slate-900/95 text-indigo-200',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce-in">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md ${borderColors[type]}`}
      >
        {icons[type]}
        <p className="text-xs font-semibold leading-snug flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
