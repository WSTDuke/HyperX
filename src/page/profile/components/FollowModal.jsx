import React from "react";
import { ShieldAlert, XCircle } from "lucide-react";

const FollowModal = ({ isOpen, onClose, onConfirm, profile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-500/10 rounded-full">
            <ShieldAlert size={24} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Unfollow User?</h3>
            <p className="text-gray-400 text-sm">
              Are you sure you want to unfollow{" "}
              <span className="text-white font-semibold">
                {profile?.full_name || "this user"}
              </span>
              ?
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-gray-300 transition-all active:scale-95"
          >
            <XCircle size={16} className="inline mr-2" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white transition-all active:scale-95"
          >
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
