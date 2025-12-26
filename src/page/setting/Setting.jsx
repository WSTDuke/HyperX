import { useState, useEffect, useRef } from "react"; 
import { supabase } from "../../routes/supabaseClient";
import { User, Shield, Camera, Save, Lock, Edit3 } from "lucide-react";

const Setting = ({ user }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        avatar_url: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [activeTab, setActiveTab] = useState("general");
    const [isEditingName, setIsEditingName] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadUser = async () => {
            let current = user;
            if (!current) {
                const { data: userData } = await supabase.auth.getUser();
                current = userData.user;
            }
            setCurrentUser(current);
            if (current) {
                setFormData({
                    name: current.user_metadata?.full_name || "",
                    email: current.email || "",
                    avatar_url: current.user_metadata?.avatar_url || "",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        };
        loadUser();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = () => {
            if (successMessage || passwordError) {
                setSuccessMessage("");
                setPasswordError("");
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [successMessage, passwordError]);

    const handleUploadAvatar = async (event) => {
        try {
            setUploading(true);
            setSuccessMessage("");

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log("1. Starting upload to storage...");
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
            if (uploadError) {
                console.error("Storage upload failed:", uploadError);
                throw uploadError;
            }

            console.log("2. Fetching public URL...");
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            console.log("3. Updating Auth Metadata...");
            const { error: authError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl },
            });
            if (authError) {
                console.error("Auth update failed:", authError);
                throw authError;
            }
            
            console.log("4. Syncing to Public Profiles table...");
            // --- QUAN TRỌNG: DÙNG UPSERT ĐỂ ĐẢM BẢO ROW TỒN TẠI ---
            const { error: syncError } = await supabase.from('profiles').upsert({ 
                id: currentUser.id,
                avatar_url: publicUrl
            });

            if (syncError) {
                console.error("Profile sync failed:", syncError);
                // Không throw ở đây để user metadata vẫn được cập nhật local
            }

            console.log("5. Refreshing session...");
            await supabase.auth.refreshSession();

            setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
            setCurrentUser((prev) => ({
                ...prev,
                user_metadata: { ...prev.user_metadata, avatar_url: publicUrl },
            }));
            
            setSuccessMessage("Avatar uploaded successfully!");

        } catch (error) {
            console.error('Final upload error:', error);
            alert(`Upload failed: ${error.message || 'Network error'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveName = async (e) => {
        e.stopPropagation();
        if (!currentUser) return;
        if (formData.name === currentUser.user_metadata?.full_name) {
            setIsEditingName(false);
            setSuccessMessage("");
            return;
        }

        const { error: authError } = await supabase.auth.updateUser({
            data: { full_name: formData.name },
        });

        if (!authError) {
            // --- QUAN TRỌNG: DÙNG UPSERT ĐỂ ĐẢM BẢO ROW TỒN TẠI ---
            await supabase.from('profiles').upsert({ 
                id: currentUser.id,
                full_name: formData.name
            });

            setIsEditingName(false);
            setSuccessMessage("Name updated successfully.");
            await supabase.auth.refreshSession();
            setCurrentUser((prev) => ({
                ...prev,
                user_metadata: { ...prev.user_metadata, full_name: formData.name },
            }));
        } else {
            console.error("Name update failed:", authError.message);
            alert("Error updating name: " + authError.message);
        }
    };

    // --- NAVIGATION TABS ---
    const tabs = [
        { id: "general", label: "Personal Info", icon: <User size={18} /> },
        { id: "avatar", label: "Avatar", icon: <Camera size={18} /> },
        { id: "security", label: "Security", icon: <Shield size={18} /> },
    ];

    return (
        <div className="bg-[#05050A] min-h-screen text-gray-300 font-sans pt-24 px-4 pb-12 relative isolate overflow-hidden">
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            <div className="fixed top-20 right-0 -z-10 w-[30rem] h-[30rem] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row bg-[#0B0D14]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
                    
                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/5 lg:bg-transparent p-6">
                        <h2 className="text-2xl font-bold text-white mb-8 px-2 tracking-tight">Settings</h2>
                        <nav className="space-y-2">
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                                        ${activeTab === tab.id 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                        
                        {/* 1. GENERAL TAB */}
                        {activeTab === "general" && currentUser && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-bold text-white mb-1">Personal Information</h3>
                                <p className="text-gray-500 mb-8">Manage your personal details.</p>
                                
                                <div className="space-y-8 max-w-xl">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    disabled={!isEditingName}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className={`w-full bg-[#05050A] border rounded-xl px-4 py-3 text-white transition-all outline-none
                                                        ${isEditingName 
                                                            ? "border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" 
                                                            : "border-white/10 text-gray-400 cursor-not-allowed"}`}
                                                />
                                            </div>
                                            {!isEditingName ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
                                                >
                                                    <Edit3 size={20} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSaveName}
                                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg"
                                                >
                                                    Save
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                        <input
                                            type="text"
                                            value={formData.email || ""}
                                            disabled
                                            className="w-full bg-[#05050A] border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-600 mt-2">Email cannot be changed.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. AVATAR TAB */}
                        {activeTab === "avatar" && currentUser && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-bold text-white mb-1">Profile Picture</h3>
                                <p className="text-gray-500 mb-8">Update your avatar to be recognized.</p>

                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                                    <div className="relative group">
                                        <div className="w-48 h-48 rounded-full p-1 border-2 border-indigo-500/50 shadow-2xl">
                                            <img
                                                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.email}`}
                                                alt="avatar"
                                                className="w-full h-full rounded-full object-cover bg-[#05050A]"
                                            />
                                        </div>
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full backdrop-blur-sm">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleUploadAvatar}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploading}
                                    />

                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        disabled={uploading}
                                        className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                    >
                                        {uploading ? "Uploading..." : "Upload New Photo"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 3. SECURITY TAB */}
                        {activeTab === "security" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-bold text-white mb-1">Security</h3>
                                <p className="text-gray-500 mb-8">Manage your password and account security.</p>

                                <div className="space-y-6 max-w-xl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.currentPassword || ""}
                                                disabled={!isEditingPassword}
                                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                className={`w-full bg-[#05050A] border rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all
                                                    ${isEditingPassword ? "border-indigo-500 focus:ring-1 focus:ring-indigo-500" : "border-white/10 text-gray-500"}`}
                                            />
                                        </div>
                                    </div>

                                    {isEditingPassword && (
                                        <div className="space-y-6 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                                                <div className="relative">
                                                    <Lock size={18} className="absolute left-4 top-3.5 text-indigo-500" />
                                                    <input
                                                        type="password"
                                                        placeholder="New password"
                                                        value={formData.newPassword || ""}
                                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                        className="w-full bg-[#05050A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock size={18} className="absolute left-4 top-3.5 text-indigo-500" />
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        value={formData.confirmPassword || ""}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                        className="w-full bg-[#05050A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        {!isEditingPassword ? (
                                            <button
                                                onClick={() => { setIsEditingPassword(true); setPasswordError(""); setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" }); }}
                                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                                            >
                                                Change Password
                                            </button>
                                        ) : (
                                            <div className="flex gap-4">
                                                <button
                                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (formData.newPassword !== formData.confirmPassword) {
                                                            setPasswordError("New passwords do not match.");
                                                            return;
                                                        }
                                                        try {
                                                            const { error: signInError } = await supabase.auth.signInWithPassword({
                                                                email: currentUser.email,
                                                                password: formData.currentPassword,
                                                            });
                                                            if (signInError) { setPasswordError("Current password is incorrect."); return; }

                                                            const { error: updateError } = await supabase.auth.updateUser({ password: formData.newPassword });
                                                            if (updateError) { setPasswordError("Failed to update password."); } else {
                                                                setSuccessMessage("Password updated successfully!");
                                                                setIsEditingPassword(false);
                                                                setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
                                                                setPasswordError("");
                                                            }
                                                        } catch (err) { console.error(err); }
                                                    }}
                                                >
                                                    Update Password
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingPassword(false)}
                                                    className="px-6 py-3 bg-transparent hover:bg-white/5 text-gray-400 rounded-xl transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {successMessage && <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"><Save size={18} /> {successMessage}</div>}
                        {passwordError && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-in fade-in slide-in-from-bottom-2">{passwordError}</div>}
                    
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Setting;