import React from "react";
import { X } from "lucide-react";

export const NotificationModal = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1e293b] border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 flex-shrink-0">
            <X size={24} />
          </div>
          <div>
            <h3 className="text-lg text-white font-bold">Invalid File</h3>
            <p className="text-gray-400 mt-1 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl text-white font-medium transition-colors shadow-lg shadow-red-900/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
