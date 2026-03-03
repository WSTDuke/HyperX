import React from "react";
import { User } from "lucide-react";

export const ProductFormInfo = ({
  productName,
  description,
  instructions,
  author,
  applicationType,
  osTags,
  setProductName,
  setDescription,
  setInstructions,
  setAuthor,
  setApplicationType,
  handleOSToggle,
  KNOWN_OS,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter glow-text-cyan">
          Basic Information
        </h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest opacity-60">
          Initialize basic details for the marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all font-mono text-sm"
              placeholder="e.g. SUPER_APP_V1.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#05050A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
              placeholder="What does your product do?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Usage Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="w-full bg-[#05050A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
              placeholder="How to install or use..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Author / Developer
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500">
                <User size={16} />
              </span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#05050A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="e.g. Google, Adobe, or your name"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:border-l lg:border-white/10 lg:pl-10">
          <div>
            <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">
              Application Type
            </label>
            <div className="space-y-3">
              {["Software", "Game"].map((app) => (
                <label
                  key={app}
                  className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200
                    ${
                      applicationType === app
                        ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  <input
                    type="radio"
                    checked={applicationType === app}
                    onChange={() => setApplicationType(app)}
                    className="w-5 h-5 accent-cyan-500"
                  />
                  <span
                    className={`ml-3 font-medium ${applicationType === app ? "text-white" : "text-gray-400"}`}
                  >
                    {app}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">
              Supported Platforms
            </label>
            <div className="space-y-3">
              {KNOWN_OS.map((os) => (
                <label
                  key={os}
                  className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200
                    ${
                      osTags.includes(os)
                        ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={osTags.includes(os)}
                    onChange={() => handleOSToggle(os)}
                    className="w-5 h-5 accent-cyan-500"
                  />
                  <span
                    className={`ml-3 font-medium ${osTags.includes(os) ? "text-white" : "text-gray-400"}`}
                  >
                    {os}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
