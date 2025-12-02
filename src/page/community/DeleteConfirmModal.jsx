import { AlertTriangle, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting, title, message }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-sm w-full p-6 relative z-10 animate-in fade-in zoom-in duration-200 mx-4">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{title || "Delete Item?"}</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        {message || "Are you sure? This action cannot be undone."}
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition text-sm font-medium flex justify-center items-center gap-2"
                        >
                            {isDeleting ? "Deleting..." : <><Trash2 size={16} /> Delete</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteConfirmModal