import { useEffect, useState } from "react";
import { supabase } from "../../routes/supabaseClient";
import { useNavigate } from "react-router-dom";
import LazyLoading from "../enhancements/LazyLoading";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const process = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (data?.session) {
                    const user = data.session.user;
                    const metadata = user.user_metadata || {};
                    
                    // --- ĐỒNG BỘ DỮ LIỆU SANG BẢNG PROFILES ---
                    const { error: updateError } = await supabase
                        .from("profiles")
                        .update({ 
                            email_verified: true,
                            full_name: metadata.full_name || metadata.name,
                            avatar_url: metadata.avatar_url || metadata.picture
                        })
                        .eq("id", user.id);

                    if (updateError) {
                        console.warn("Sync profile failed:", updateError);
                    }
                    
                    // Nếu là đăng ký/xác thực email thông thường -> Sign out để bắt đăng nhập lại
                    // Nếu là social login (có metadata) -> Có thể chuyển hướng trực tiếp
                    if (!metadata.full_name) {
                        await supabase.auth.signOut();
                    }
                }

                setTimeout(() => {
                    setLoading(false);
                    navigate("/signin", {
                        replace: true,
                        state: {
                            message: "Email xác thực thành công! Vui lòng đăng nhập."
                        }
                    });
                }, 600);

            } catch (err) {
                console.error("Callback error:", err);
                setError(err.message);
                setTimeout(() => navigate("/signin"), 2000);
            }
        };

        process();
    }, [navigate]);

    // BACKGROUND: ĐỒNG BỘ VỚI THEME CHÍNH
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#05050A]">
                <LazyLoading status={'Verifying...'} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#05050A] text-center p-6">
                <div className="bg-[#0B0D14] border border-red-500/20 p-8 rounded-2xl max-w-sm w-full">
                    <p className="text-red-400 font-medium mb-2">Verification Failed</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                    <p className="text-gray-500 text-xs mt-4">Redirecting...</p>
                </div>
            </div>
        );
    }

    return null;
}