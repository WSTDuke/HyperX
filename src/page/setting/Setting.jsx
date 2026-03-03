import { useState } from "react";
import { User, Shield, Camera, Save } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { ProfileSettings } from "./components/ProfileSettings";
import { AvatarSettings } from "./components/AvatarSettings";
import { SecuritySettings } from "./components/SecuritySettings";

const Setting = ({ user }) => {
  const { state, refs, actions } = useSettings(user);
  const [activeTab, setActiveTab] = useState("general");

  const {
    currentUser,
    formData,
    isEditingName,
    successMessage,
    isEditingPassword,
    passwordError,
    uploading,
  } = state;

  const { fileInputRef } = refs;

  const {
    setFormData,
    setIsEditingName,
    setSuccessMessage,
    setIsEditingPassword,
    setPasswordError,
    handleUploadAvatar,
    handleSaveName,
    handleSavePassword,
  } = actions;

  const tabs = [
    { id: "general", label: "Personal Info", icon: <User size={18} /> },
    { id: "avatar", label: "Avatar", icon: <Camera size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  return (
    <div className="bg-[#020205] min-h-screen text-gray-300 font-sans pt-24 px-4 pb-12 relative isolate overflow-hidden">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="fixed top-20 right-0 -z-10 w-[40rem] h-[40rem] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row bg-[#0B0D14]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] min-h-[700px]">
          <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02] p-8">
            <div className="mb-12 px-2">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Settings
              </h2>
              <p className="text-xs text-cyan-500/60 font-mono mt-1 tracking-widest uppercase font-bold">
                Account Preference
              </p>
            </div>

            <nav className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsEditingName(false);
                    setIsEditingPassword(false);
                    setPasswordError("");
                    setSuccessMessage("");
                    if (currentUser) {
                      setFormData((prev) => ({
                        ...prev,
                        name: currentUser.user_metadata?.full_name || prev.name,
                      }));
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 group
                    ${
                      activeTab === tab.id
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                        : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`transition-transform duration-300 ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110"}`}
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                  </div>
                  {activeTab === tab.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-10 hidden lg:block">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/10">
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  "Personalize your experience to make HyperX truly yours."
                </p>
              </div>
            </div>
          </aside>

          <main className="flex-1 p-8 lg:p-16 overflow-y-auto custom-scrollbar bg-gradient-to-br from-white/[0.01] to-transparent">
            {activeTab === "general" && currentUser && (
              <ProfileSettings
                formData={formData}
                isEditingName={isEditingName}
                setFormData={setFormData}
                setIsEditingName={setIsEditingName}
                handleSaveName={handleSaveName}
              />
            )}

            {activeTab === "avatar" && currentUser && (
              <AvatarSettings
                formData={formData}
                uploading={uploading}
                fileInputRef={fileInputRef}
                handleUploadAvatar={handleUploadAvatar}
              />
            )}

            {activeTab === "security" && (
              <SecuritySettings
                formData={formData}
                isEditingPassword={isEditingPassword}
                setFormData={setFormData}
                setIsEditingPassword={setIsEditingPassword}
                setPasswordError={setPasswordError}
                handleSavePassword={handleSavePassword}
              />
            )}

            <div className="fixed top-24 right-12 z-[100] flex flex-col gap-4 pointer-events-none">
              {successMessage && (
                <div className="p-5 bg-cyan-500 text-black font-black rounded-2xl flex items-center gap-4 shadow-[0_20px_50px_rgba(6,182,212,0.3)] animate-in slide-in-from-right-full transition-all duration-500 pointer-events-auto">
                  <div className="bg-black/10 p-2 rounded-lg">
                    <Save size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest leading-none mb-1 opacity-70 font-mono">
                      System Notice
                    </p>
                    <p className="text-sm">{successMessage}</p>
                  </div>
                  <button
                    onClick={() => setSuccessMessage("")}
                    className="ml-4 hover:opacity-50 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
              {passwordError && (
                <div className="p-5 bg-red-500 text-white font-black rounded-2xl flex items-center gap-4 shadow-[0_20px_50px_rgba(239,68,68,0.3)] animate-in slide-in-from-right-full transition-all duration-500 pointer-events-auto">
                  <div className="bg-black/10 p-2 rounded-lg">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest leading-none mb-1 opacity-70 font-mono">
                      Security Alert
                    </p>
                    <p className="text-sm">{passwordError}</p>
                  </div>
                  <button
                    onClick={() => setPasswordError("")}
                    className="ml-4 hover:opacity-50 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Setting;
