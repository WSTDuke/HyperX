import { useState, useEffect, useRef } from "react"; // Thêm useRef
import { supabase } from "../../routes/supabaseClient";

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
    
    // State mới để quản lý loading khi upload ảnh
    const [uploading, setUploading] = useState(false);
    // Ref để trỏ tới thẻ input file ẩn
    const fileInputRef = useRef(null);

    // Load user info
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

    // Hide messages on click outside
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

    // --- LOGIC UPLOAD AVATAR MỚI ---
    const handleUploadAvatar = async (event) => {
        try {
            setUploading(true);
            setSuccessMessage("");

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            // Tạo tên file unique để tránh cache trình duyệt (dùng timestamp)
            const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload ảnh lên Supabase Storage (Bucket 'avatars')
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Lấy đường dẫn công khai (Public URL)
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // 3. Cập nhật User Metadata với URL mới
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl },
            });

            if (updateError) {
                throw updateError;
            }

            // 4. Update thành công -> Refresh Session để Header cập nhật ảnh
            await supabase.auth.refreshSession();

            // 5. Cập nhật state nội bộ
            setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
            setCurrentUser((prev) => ({
                ...prev,
                user_metadata: { ...prev.user_metadata, avatar_url: publicUrl },
            }));
            
            setSuccessMessage("Avatar uploaded and updated successfully!");

        } catch (error) {
            console.error('Error uploading avatar:', error.message);
            alert(error.message);
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

        const { error } = await supabase.auth.updateUser({
            data: { full_name: formData.name },
        });

        if (!error) {
            setIsEditingName(false);
            setSuccessMessage("Your name has been successfully updated.");
            
            // Refresh session khi đổi tên
            await supabase.auth.refreshSession();

            setCurrentUser((prev) => ({
                ...prev,
                user_metadata: { ...prev.user_metadata, full_name: formData.name },
            }));
        } else {
            console.error(error.message);
        }
    };

    return (
        <div className="relative isolate pt-24 px-6 md:px-48 bg-gray-900 overflow-hidden min-h-screen">
            {/* ... Phần background giữ nguyên ... */}
             <div className="h-[550px] flex mb-16">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[1155px] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[2300px]"
                    />
                </div>

                {/* Layout */}
                <div className="relative w-full max-w-7xl bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-64 border-r border-gray-700 p-6">
                        <h2 className="text-white text-xl font-bold mb-6">Settings</h2>
                        <nav className="space-y-2">
                            {[
                                { id: "general", label: "Personal Details" },
                                { id: "avatar", label: "Avatar" },
                                { id: "security", label: "Privacy" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsEditingName(false);
                                        setIsEditingPassword(false);
                                        setPasswordError("");
                                        setSuccessMessage("");
                                        // Reset form data khi chuyển tab
                                        if (currentUser) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: currentUser.user_metadata?.full_name || prev.name,
                                                avatar_url: currentUser.user_metadata?.avatar_url || prev.avatar_url,
                                            }));
                                        }
                                    }}
                                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === item.id
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                        : "text-gray-300 hover:bg-gray-700/40"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main */}
                    <main className="flex-1 p-10 text-white overflow-y-auto">
                        {/* TAB GENERAL - Giữ nguyên logic cũ */}
                        {activeTab === "general" && currentUser && (
                            <div>
                                <h3 className="text-2xl font-bold mb-6">Account details</h3>
                                <div className="space-y-6 max-w-3xl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200">Full name</label>
                                        <div className="flex justify-between items-center gap-4">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                disabled={!isEditingName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                className={`mt-2 w-2/4 rounded-md px-3 py-2 ${isEditingName
                                                    ? "bg-white/20 text-white outline outline-1 outline-indigo-500"
                                                    : "bg-white/10 text-gray-400 outline outline-1 outline-white/20 cursor-not-allowed"
                                                    }`}
                                            />
                                            {!isEditingName ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsEditingName(true);
                                                        setSuccessMessage("");
                                                    }}
                                                    className="mt-2 bg-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-500 transition"
                                                >
                                                    Change name
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSaveName}
                                                    className="mt-2 bg-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-500 transition"
                                                >
                                                    Save changes
                                                </button>
                                            )}
                                        </div>
                                        {successMessage && (
                                            <p className="mt-2 text-green-400 text-sm">{successMessage}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-200">Email</label>
                                        <input
                                            type="text"
                                            value={formData.email || ""}
                                            disabled
                                            className="mt-2 w-2/4 rounded-md bg-white/10 px-3 py-2 text-white outline outline-1 outline-white/20 focus:outline-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB AVATAR - Logic mới */}
                        {activeTab === "avatar" && currentUser && (
                            <div>
                                <h3 className="text-2xl font-bold mb-6">Your avatar</h3>
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <img
                                            src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.email}`}
                                            alt="avatar"
                                            className="w-60 h-60 rounded-full border-4 border-indigo-500 shadow-xl my-4 object-cover"
                                        />
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input file ẩn */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleUploadAvatar}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploading}
                                    />

                                    <button
                                        onClick={() => fileInputRef.current.click()} // Kích hoạt input file
                                        disabled={uploading}
                                        className={`mt-4 w-1/4 px-5 py-2.5 rounded-lg font-semibold transition ${
                                            uploading 
                                            ? "bg-gray-600 cursor-not-allowed" 
                                            : "bg-indigo-600 hover:bg-indigo-500"
                                        }`}
                                    >
                                        {uploading ? "Uploading..." : "Upload new photo"}
                                    </button>
                                    
                                    {successMessage && (
                                        <p className="mt-4 text-green-400 text-sm">{successMessage}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB SECURITY - Giữ nguyên logic cũ */}
                        {activeTab === "security" && (
                            <div>
                                {/* ... (Code phần security giữ nguyên như cũ) ... */}
                                <h3 className="text-2xl font-bold mb-6">Password</h3>
                                <div className="flex flex-col space-y-3 max-w-3xl">
                                    <label className="block text-sm font-medium text-gray-200">
                                        Current password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="**************"
                                        value={formData.currentPassword || ""}
                                        disabled={!isEditingPassword}
                                        onChange={(e) =>
                                            setFormData({ ...formData, currentPassword: e.target.value })
                                        }
                                        className="w-2/4 rounded-md bg-white/10 px-3 py-2 text-white outline outline-1 outline-white/20 focus:outline-indigo-500"
                                    />
                                    {passwordError && (
                                        <p className="text-red-400 text-sm">{passwordError}</p>
                                    )}

                                    {isEditingPassword && (
                                        <>
                                            <label className="block text-sm font-medium text-gray-200">
                                                New password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="**************"
                                                value={formData.newPassword || ""}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, newPassword: e.target.value })
                                                }
                                                className="w-2/4 rounded-md bg-white/10 px-3 py-2 text-white outline outline-1 outline-white/20 focus:outline-indigo-500"
                                            />

                                            <label className="block text-sm font-medium text-gray-200">
                                                Confirm new password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="**************"
                                                value={formData.confirmPassword || ""}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                                }
                                                className="w-2/4 rounded-md bg-white/10 px-3 py-2 text-white outline outline-1 outline-white/20 focus:outline-indigo-500"
                                            />
                                        </>
                                    )}

                                    <button
                                        className="mt-2 w-1/4 bg-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-500 transition"
                                        onClick={async (e) => {
                                            e.stopPropagation();

                                            if (!isEditingPassword) {
                                                setIsEditingPassword(true);
                                                setPasswordError("");
                                                setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
                                                return;
                                            }

                                            if (formData.newPassword !== formData.confirmPassword) {
                                                setPasswordError("New passwords do not match.");
                                                return;
                                            }

                                            try {
                                                const { error: signInError } = await supabase.auth.signInWithPassword({
                                                    email: currentUser.email,
                                                    password: formData.currentPassword,
                                                });

                                                if (signInError) {
                                                    setPasswordError("Current password is incorrect.");
                                                    return;
                                                }

                                                const { error: updateError } = await supabase.auth.updateUser({
                                                    password: formData.newPassword
                                                });

                                                if (updateError) {
                                                    setPasswordError("Failed to update password.");
                                                } else {
                                                    setSuccessMessage("Password updated successfully!");
                                                    setIsEditingPassword(false);
                                                    setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
                                                    setPasswordError("");
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                    >
                                        {isEditingPassword ? "Save changes" : "Change password"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Setting;