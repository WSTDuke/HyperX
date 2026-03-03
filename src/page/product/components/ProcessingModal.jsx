import React from "react";
import { Upload, ImageIcon, Package } from "lucide-react";

export const ProcessingModal = ({
  isVisible,
  imageProgress,
  uploadProgress,
  osTags,
  filesByOS,
  selectedImage,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      <div className="relative bg-[#0B0D14] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto mb-4 animate-pulse">
            <Upload size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white">Processing Product</h3>
          <p className="text-gray-400 mt-2">
            Please wait while we upload your assets and save data.
          </p>
        </div>

        <div className="space-y-6">
          {selectedImage && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 flex items-center gap-2">
                  <ImageIcon size={16} className="text-cyan-400" /> Cover Image
                </span>
                <span className="text-cyan-400 font-medium">
                  {imageProgress}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  style={{ width: `${imageProgress}%` }}
                />
              </div>
            </div>
          )}

          {osTags.map((os) => {
            if (!filesByOS[os]) return null;
            const progress = uploadProgress[os] || 0;
            return (
              <div key={os} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 flex items-center gap-2">
                    <Package size={16} className="text-cyan-400" /> {os}{" "}
                    Installer
                  </span>
                  <span className="text-cyan-400 font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 py-3 px-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">
            Secure Upload in Progress
          </span>
        </div>
      </div>
    </div>
  );
};
