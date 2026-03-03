import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export const ProductReview = ({
  productName,
  applicationType,
  author,
  osTags,
  filesByOS,
  existingDownloadLinks,
  previewUrl,
  existingImageUrl,
  isEditMode,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <CheckCircle size={40} className="text-cyan-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter glow-text-cyan">
          Ready to Deploy
        </h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest opacity-60">
          Review your configuration before submission.
        </p>
      </div>

      <div className="bg-[#05050A] rounded-2xl border border-white/10 p-8 max-w-2xl mx-auto shadow-2xl">
        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
          Data Audit Log
        </h3>
        <dl className="space-y-4">
          <div className="flex justify-between py-3 border-b border-white/5">
            <dt className="text-gray-500 text-sm uppercase tracking-widest font-bold">Product Name</dt>
            <dd className="text-white font-mono text-sm">{productName}</dd>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <dt className="text-gray-500 text-sm uppercase tracking-widest font-bold">Type</dt>
            <dd className="text-cyan-400 font-bold tracking-widest uppercase text-sm">
              {applicationType}
            </dd>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <dt className="text-gray-500 text-sm uppercase tracking-widest font-bold">Author</dt>
            <dd className="text-gray-300">{author || "N/A"}</dd>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <dt className="text-gray-500 text-sm uppercase tracking-widest font-bold">Platforms</dt>
            <dd className="flex gap-2">
              {osTags.map((os) => (
                <span
                  key={os}
                  className="bg-white/10 px-2 py-0.5 rounded text-xs text-white font-medium"
                >
                  {os}
                </span>
              ))}
            </dd>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <dt className="text-gray-500 text-sm uppercase tracking-widest font-bold">Files Ready</dt>
            <dd className="text-gray-300 text-sm">
              {Object.keys(filesByOS).length > 0
                ? Object.keys(filesByOS).join(", ")
                : isEditMode && Object.keys(existingDownloadLinks).length > 0
                  ? "Changes preserved; existing files used."
                  : "None"}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-gray-500 text-sm uppercase tracking-widest font-bold">Cover Image</dt>
            <dd className="text-gray-300">
              {previewUrl || existingImageUrl ? (
                <span className="text-green-400 flex items-center gap-1 font-medium text-sm">
                  <CheckCircle size={14} /> Provided
                </span>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-8 p-4 bg-cyan-950/30 rounded-xl border border-cyan-500/20 flex gap-4">
          <AlertCircle size={24} className="text-cyan-400 flex-shrink-0" />
          <p className="text-sm text-cyan-200/80 leading-relaxed font-medium">
            By submitting this product, you confirm that you have the rights to
            distribute these files and that they comply with our terms of
            service.
          </p>
        </div>
      </div>
    </div>
  );
};
