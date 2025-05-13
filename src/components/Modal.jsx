import React from 'react';

export default function Modal({ open, onClose, title, children, type = 'info', wide }) {
  if (!open) return null;
  const accent = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`relative ${wide ? 'max-w-5xl' : 'max-w-md'} w-full rounded-2xl shadow-2xl bg-white animate-fadeIn`}>
        <div className={`flex items-center justify-between px-6 py-3 rounded-t-2xl ${accent} text-white`}>
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-200">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
} 