import { AlertTriangle, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting, title, message }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen">
            {/* Backdrop làm tối nền */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative z-10 animate-in fade-in zoom-in duration-200 mx-4">
                <div className="flex flex-col items-center text-center">
                    
                    {/* Icon Warning */}
                    <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-5 ring-1 ring-red-500/20">
                        <AlertTriangle size={28} className="text-red-500" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{title || "Delete Item?"}</h3>
                    
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        {message || "Are you sure? This action cannot be undone."}
                    </p>
                    
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white rounded-xl transition-all text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all text-sm font-medium flex justify-center items-center gap-2 shadow-lg shadow-red-900/20"
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

export default DeleteConfirmModal;