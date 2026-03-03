import React from "react";
import { Camera } from "lucide-react";

export const AvatarSettings = ({
  formData,
  uploading,
  fileInputRef,
  handleUploadAvatar,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-white mb-2">Display Avatar</h3>
        <p className="text-gray-500">
          Pick an image that represents you across the HyperX ecosystem.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-12 border border-white/5 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

        <div className="relative z-10">
          <div
            className={`relative w-64 h-64 rounded-full p-2 border-2 transition-all duration-500 ${uploading ? "border-cyan-500 animate-pulse" : "border-white/5 group-hover:border-cyan-500/30"}`}
          >
            <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative">
              <img
                src={
                  formData.avatar_url ||
                  `https://ui-avatars.com/api/?name=${formData.email}&background=06b6d4&color=fff`
                }
                alt="avatar"
                className="w-full h-full object-cover bg-[#05050A] transition-transform duration-700 group-hover:scale-110"
              />
              {uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                  <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase">
                    Processing
                  </span>
                </div>
              )}

              {!uploading && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]"
                >
                  <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center text-black scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <Camera size={20} />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUploadAvatar}
          accept="image/*"
          className="hidden"
          disabled={uploading}
        />

        <div className="mt-12 text-center relative z-10">
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-cyan-50 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {uploading ? "Updating System..." : "Change Appearance"}
          </button>
          <p className="mt-6 text-xs text-gray-500 font-medium">
            JPG, PNG or WEBP. Max 2MB recommended.
          </p>
        </div>
      </div>
    </div>
  );
};
