import React from "react";
import { Lock, Shield, Save } from "lucide-react";

export const SecuritySettings = ({
  formData,
  isEditingPassword,
  setFormData,
  setIsEditingPassword,
  setPasswordError,
  handleSavePassword,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-white mb-2">Security Vault</h3>
        <p className="text-gray-500">
          Protect your account by regularly updating your credentials.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-md">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">
              Current Password
            </label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-hover:text-cyan-500/50">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Verification required"
                value={formData.currentPassword || ""}
                disabled={!isEditingPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className={`w-full bg-black/40 border rounded-2xl pl-16 pr-6 py-4 text-white outline-none transition-all duration-300
                  ${
                    isEditingPassword
                      ? "border-cyan-500/50 focus:border-cyan-400 ring-4 ring-cyan-500/5"
                      : "border-white/5 text-gray-500 italic font-mono"
                  }`}
              />
            </div>
          </div>

          {isEditingPassword && (
            <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div>
                <label className="block text-xs font-bold text-cyan-500/70 uppercase tracking-widest mb-3 font-mono">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500/40">
                    <Shield size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter new strong password"
                    value={formData.newPassword || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white focus:border-cyan-400 ring-4 ring-cyan-500/5 outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-cyan-500/70 uppercase tracking-widest mb-3 font-mono">
                  Confirm Secret
                </label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500/40">
                    <Save size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={formData.confirmPassword || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white focus:border-cyan-400 ring-4 ring-cyan-500/5 outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-4">
          {!isEditingPassword ? (
            <button
              onClick={() => {
                setIsEditingPassword(true);
                setPasswordError("");
                setFormData({
                  ...formData,
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="px-10 py-4 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-white font-black tracking-wide transition-all active:scale-95"
            >
              Initiate Password Reset
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditingPassword(false)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
              >
                Cancel Change
              </button>
              <button
                className="flex-1 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-95"
                onClick={handleSavePassword}
              >
                Securely Update Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
