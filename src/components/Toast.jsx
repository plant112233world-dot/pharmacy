import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    danger: 'border-rose-200 bg-rose-50 text-rose-900',
    info: 'border-cyan-200 bg-cyan-50 text-cyan-900'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-xs font-semibold pr-2">{toast.message}</p>
      </div>
    </div>
  );
};
