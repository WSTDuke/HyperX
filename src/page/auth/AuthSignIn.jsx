import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../routes/supabaseClient";
import LazyLoading from "../enhancements/LazyLoading";

const AuthSignIn = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loggingIn, setLoggingIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { email, password } = formData;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoading(false);
                let errorText = "Đã xảy ra lỗi trong quá trình đăng nhập.";

                if (error.message.includes("Invalid login credentials")) {
                    errorText = "Email hoặc mật khẩu không chính xác.";
                } else if (error.message.includes("Email not confirmed")) {
                    errorText = "Email chưa được xác nhận. Vui lòng kiểm tra email.";
                } else {
                    errorText = error.message;
                }

                setMessage({ type: "error", text: errorText });
                return;
            }

            if (data.user && !data.user.email_confirmed_at) {
                setLoading(false);
                await supabase.auth.signOut();
                setTimeout(() => {
                    navigate("/verify", {
                        state: {
                            email,
                            message: "Please verify your email before signing in."
                        }
                    });
                }, 1500);
                return;
            }

            setLoading(false);
            setMessage({ type: "success", text: `Đăng nhập thành công!` });
            setLoggingIn(true);

            setTimeout(() => {
                navigate("/");
            }, 800);

        } catch (e) {
            setLoading(false);
            setMessage({ type: "error", text: e.message });
        }
    };

    return (
        // BACKGROUND: #05050A + Ambient Light
        <div className="relative isolate flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-[#05050A] overflow-hidden">
            {loggingIn && <LazyLoading status={'Logging in...'} />}

            {/* --- 1. NOISE TEXTURE (Tạo độ nhám cho nền) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

            {/* --- 2. AMBIENT LIGHTS (Đốm sáng) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* === MAIN CARD === */}
            <div className="relative w-full max-w-md bg-[#0B0D14]/60 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-10 shadow-2xl z-10 sm:px-10">
                
                {/* Header Logo/Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to continue to <span className="font-semibold text-indigo-400">HyperX</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-[#0B0D14] focus:ring-1 focus:ring-indigo-500 transition-all outline-none sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <Link className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-[#0B0D14] focus:ring-1 focus:ring-indigo-500 transition-all outline-none sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium flex items-center justify-center animate-in fade-in slide-in-from-top-1 ${message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthSignIn;