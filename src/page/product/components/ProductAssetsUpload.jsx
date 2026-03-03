import React from "react";
import { Monitor, Package, CheckCircle, Image as ImageIcon, Upload } from "lucide-react";

export const ProductAssetsUpload = ({
  osTags,
  filesByOS,
  existingDownloadLinks,
  uploadProgress,
  handleFileChange,
  previewUrl,
  existingImageUrl,
  handleImageChange,
  imageProgress,
  ACCEPT_ATTR,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter glow-text-cyan">
          Upload Files
        </h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest opacity-60">
          Upload installation packages and visual identifiers.
        </p>
      </div>

      <div className="grid gap-8">
        <div className="bg-[#05050A] p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-6 text-cyan-300 flex items-center gap-2">
            <Monitor size={20} /> Installer Packages
          </h3>

          {osTags.length === 0 ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-center">
              Please go back and select at least one OS in Step 1.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {osTags.map((os) => (
                <div
                  key={os}
                  className="bg-[#1e1e1e]/50 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-bold text-sm bg-white/10 px-2 py-1 rounded">
                      {os}
                    </span>
                    <label className="cursor-pointer bg-cyan-600 hover:bg-cyan-500 px-4 py-1.5 rounded-lg text-xs font-bold text-black transition-colors shadow-lg shadow-cyan-500/20">
                      Select File
                      <input
                        type="file"
                        accept={ACCEPT_ATTR[os]}
                        onChange={(e) => handleFileChange(e, os)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black/30 rounded-lg">
                      <Package
                        size={20}
                        className={
                          filesByOS[os]
                            ? "text-green-400"
                            : "text-gray-600"
                        }
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-gray-400 truncate">
                        {filesByOS[os]?.name ||
                          existingDownloadLinks[os]
                            ?.split("/")
                            .pop() ||
                          "No file selected"}
                      </p>
                    </div>
                  </div>

                  {uploadProgress[os] > 0 &&
                    uploadProgress[os] < 100 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress[os]}%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full transition-all duration-300"
                            style={{
                              width: `${uploadProgress[os]}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  {uploadProgress[os] === 100 && (
                    <div className="mt-3 text-xs text-green-400 flex items-center gap-1 font-medium bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                      <CheckCircle size={12} /> Ready to submit
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#05050A] p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
              <ImageIcon size={20} /> Cover Image
            </h3>
            {!previewUrl && !existingImageUrl && (
              <label className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-xl cursor-pointer transition-colors text-sm font-medium">
                Browse
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {previewUrl || existingImageUrl ? (
            <div className="space-y-4">
              <div className="relative w-full max-w-lg aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                <img
                  src={previewUrl || existingImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md font-medium flex items-center gap-2">
                    <Upload size={18} /> Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              {imageProgress > 0 && imageProgress < 100 && (
                <div className="w-full max-w-lg">
                  <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all duration-300"
                      style={{ width: `${imageProgress}%` }}
                    />
                  </div>
                  <p className="text-right text-[10px] text-gray-400 mt-1">
                    {imageProgress}%
                  </p>
                </div>
              )}
            </div>
          ) : (
            <label className="w-full max-w-lg aspect-video border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-[#1e1e1e]/30 hover:bg-[#1e1e1e]/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group">
              <div className="p-4 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon
                  size={32}
                  className="text-gray-500 group-hover:text-cyan-400"
                />
              </div>
              <span className="text-gray-400 font-medium group-hover:text-white">
                Click to upload cover image
              </span>
              <span className="text-xs text-gray-500 mt-2">
                PNG, JPG, WEBP up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
