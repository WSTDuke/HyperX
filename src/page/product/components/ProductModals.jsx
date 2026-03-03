import React from "react";
import { AlertTriangle, Download, X } from "lucide-react";

export const ProductModals = ({
  showModal,
  setShowModal,
  availableOS,
  handleDownloadAction,
  showDeleteModal,
  setShowDeleteModal,
  isDeleting,
  handleConfirmDelete,
}) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">
              Select Platform
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Choose the installer for your operating system.
            </p>
            <div className="space-y-3">
              {availableOS.map((os) => (
                <button
                  key={os}
                  onClick={() => handleDownloadAction(os)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0B0D14] hover:bg-cyan-600/10 border border-white/10 hover:border-cyan-500/50 text-white flex justify-between items-center transition-all group"
                >
                  <span className="font-medium">{os}</span>
                  <Download
                    size={18}
                    className="text-gray-500 group-hover:text-cyan-400"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. This will permanently delete your
              product and all associated files.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
