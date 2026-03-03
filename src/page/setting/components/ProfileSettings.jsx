import React from "react";
import { Edit3, Lock } from "lucide-react";

export const ProfileSettings = ({
  formData,
  isEditingName,
  setFormData,
  setIsEditingName,
  handleSaveName,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-white mb-2">Personal Identity</h3>
        <p className="text-gray-500">
          Your profile information is visible to other members of the community.
        </p>
      </div>

      <div className="space-y-10 max-w-2xl">
        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-6 font-mono">
            Profile Name
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={formData.name}
                disabled={!isEditingName}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-black/40 border rounded-2xl px-6 py-4 text-white transition-all duration-300 outline-none
                  ${
                    isEditingName
                      ? "border-cyan-500/50 focus:border-cyan-400 ring-4 ring-cyan-500/5"
                      : "border-white/5 text-gray-400 opacity-80 cursor-not-allowed"
                  }`}
                placeholder="Your full name"
              />
            </div>
            {!isEditingName ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
                className="px-6 py-4 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-white transition-all flex items-center justify-center gap-2 font-bold group"
              >
                <Edit3 size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                <span>Change</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveName}
                  className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-6 font-mono">
            Profile Bio
          </label>
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <textarea
                value={formData.bio}
                disabled={!isEditingName}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className={`w-full bg-black/40 border rounded-2xl px-6 py-4 text-white transition-all duration-300 outline-none min-h-[100px] resize-none
                  ${
                    isEditingName
                      ? "border-cyan-500/50 focus:border-cyan-400 ring-4 ring-cyan-500/5"
                      : "border-white/5 text-gray-400 opacity-80 cursor-not-allowed"
                  }`}
                placeholder="Tell the community about yourself..."
              />
            </div>
          </div>
        </section>

        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md opacity-70">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 font-mono">
            Email Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.email || ""}
              disabled
              className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-gray-500 cursor-not-allowed italic font-mono"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <Lock size={16} className="text-gray-700" />
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-tighter">
            Verified email cannot be modified for security reasons.
          </p>
        </section>
      </div>
    </div>
  );
};
