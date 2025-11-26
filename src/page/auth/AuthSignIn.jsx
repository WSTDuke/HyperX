import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../supabaseClient";

const AuthSignIn = () => {
    const navigate = useNavigate();

    const SUPABASE_URL = "https://tfyzavnudmmaxyuaeujb.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmeXphdm51ZG1tYXh5dWFldWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1MjAsImV4cCI6MjA3OTcxMTUyMH0.l4AGGDyGJC1_REEbTMxKDQn-h0UWwhSYy5vTsdSJfDQ";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (SUPABASE_URL.includes('your-project-id')) {
            setMessage({ type: 'error', text: "LƯU Ý: Vui lòng cập nhật SUPABASE URL và KEY. Đang sử dụng Mock Client." });
        }

        setLoading(true);
        setMessage(null);
        const { email, password } = formData;

        try {
            // 1. Đăng nhập
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
                    errorText = "Email chưa được xác nhận. Vui lòng kiểm tra email của bạn.";
                } else {
                    errorText = `Lỗi đăng nhập: ${error.message}`;
                }
                setMessage({ type: 'error', text: errorText });
                console.error("Supabase Sign In Error:", error);
                return;
            }

            // 2. Kiểm tra xem email đã được verify chưa
            if (data.user) {
                console.log("User data:", data.user);

                // Kiểm tra email_confirmed_at
                if (!data.user.email_confirmed_at) {
                    // Email chưa được verify
                    setLoading(false);

                    // Đăng xuất ngay lập tức
                    await supabase.auth.signOut();

                    setMessage({
                        type: 'error',
                        text: "Please verify your email before signing in. Check your inbox for the confirmation link."
                    });

                    // Chuyển đến trang verify sau 2 giây
                    setTimeout(() => {
                        navigate('/verify', {
                            state: {
                                email: email,
                                message: 'Please check your email to confirm your account before signing in.'
                            }
                        });
                    }, 2000);

                    return;
                }

                // Email đã verify, cho phép đăng nhập
                setLoading(false);
                setMessage({
                    type: 'success',
                    text: `Đăng nhập thành công! Welcome ${data.user.email}`
                });

                console.log("User signed in:", data.user);

                // Chuyển đến trang chủ sau 1 giây
                setTimeout(() => {
                    navigate('/');
                }, 1000);

            } else {
                setLoading(false);
                setMessage({ type: 'error', text: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." });
            }
        } catch (e) {
            setLoading(false);
            setMessage({ type: 'error', text: `Lỗi hệ thống: ${e.message}` });
        }
    }

    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-gray-900 min-h-screen">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
                />
            </div>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-12">
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <Link to="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`px-4 py-2 rounded-md text-center text-sm/6 font-medium ${message.type === 'error'
                                    ? 'bg-red-900/50 text-red-300'
                                    : 'bg-green-900/50 text-green-300'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.email || !formData.password}
                                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                            Not a member?{' '}
                            <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                />
            </div>
        </div>
    )
}

export default AuthSignIn