import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../routes/supabaseClient";

const AuthSignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { email, password, name, phone } = formData;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: { full_name: name, phone_number: phone },
            },
        });

        setLoading(false);

        if (error) {
            console.error("Supabase sign up error:", error.message);
            setMessage("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
            return;
        }

        navigate("/verify", {
            state: {
                email,
                message: "Please check your email to verify your account. You will be redirected back once verified."
            }
        });
    };

    // Keep auth listener hook
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {});
        return () => { authListener.subscription.unsubscribe(); };
    }, []);

    return (
        <div className="relative isolate flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-[#05050A] overflow-hidden">
            
            {/* NOISE & AMBIENT LIGHT */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            <div className="absolute top-[-20%] left-[20%] w-[50rem] h-[50rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* CARD */}
            <div className="relative w-full max-w-md bg-[#0B0D14]/70 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-10 shadow-2xl z-10">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-400">Join <span className="font-semibold text-indigo-400">HyperX</span> community today</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-[#0B0D14] focus:ring-1 focus:ring-indigo-500 transition-all outline-none sm:text-sm"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-[#0B0D14] focus:ring-1 focus:ring-indigo-500 transition-all outline-none sm:text-sm"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-[#0B0D14] focus:ring-1 focus:ring-indigo-500 transition-all outline-none sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-[#0B0D14] focus:ring-1 focus:ring-indigo-500 transition-all outline-none sm:text-sm"
                            placeholder="Create a strong password"
                        />
                    </div>

                    {message && (
                        <div className="p-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 text-center animate-in fade-in slide-in-from-top-1">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 py-3 mt-4 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/signin" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Sign in
                    </Link>
                </div>
                <div className="mt-4 text-center">
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthSignUp;