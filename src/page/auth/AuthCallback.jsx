import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const process = async () => {
            try {
                // Lấy session sau khi verify email
                const { data, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (data?.session) {
                    // Đánh dấu email đã verify trong user_profiles
                    const { error: updateError } = await supabase
                        .from('user_profiles')
                        .update({ email_verified: true })
                        .eq('id', data.session.user.id);

                    if (updateError) {
                        console.error('Error updating verification status:', updateError);
                    }

                    // Đăng nhập thành công
                    navigate("/", { replace: true });
                } else {
                    // Chưa có session, redirect về signin
                    navigate("/signin", { replace: true });
                }
            } catch (err) {
                console.error("Callback error:", err);
                setError(err.message);
                setTimeout(() => navigate("/signin"), 3000);
            }
        };

        process();
    }, [navigate]);

    if (error) {
        return (
            <div className="text-white p-10 text-center">
                <p className="text-red-400">Error: {error}</p>
                <p className="mt-2">Redirecting to sign in...</p>
            </div>
        );
    }

    return (
        <div className="text-white p-10 text-center">
            <p>Processing verification...</p>
        </div>
    );
}