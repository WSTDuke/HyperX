import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../supabaseClient";


const AuthSignUp = () => {
    const navigate = useNavigate()
    // Sử dụng Object State duy nhất cho dữ liệu form
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [message, setMessage] = useState(''); // Thông báo lỗi/thành công

    // Hàm handleChange chung cho tất cả input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // LOGIC ĐĂNG KÝ (Sử dụng hàm mock Supabase)
    // Trong AuthSignUp.jsx
    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { email, password } = formData;

        // 1. Đăng ký
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    full_name: formData.name,
                    phone_number: formData.phone,
                },
            },
        });

        console.log(data)
        console.log(error);
        setLoading(false);

        if (error) {
            setMessage(`Error: ${error.message}`);
            return;
        }

        // 2. Kiểm tra xem user có cần confirm không
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            // Email đã tồn tại
            setMessage('Email already registered. Please sign in.');
            return;
        }

        // 3. Luôn chuyển đến trang verify sau khi đăng ký thành công
        setMessage('Account created! Please check your email to verify.');
        navigate('/verify', {
            state: {
                email: email,
                message: 'Please check your email to confirm your account.'
            }
        });
    };
    // Auth State Listener (Giữ lại để duy trì cấu trúc)
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // Logic xử lý khi trạng thái xác thực thay đổi
            }
        );

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    return (
        <div className="relative isolate px-6 pt-6 lg:px-8 bg-gray-900 min-h-screen">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>
            <div className="mx-auto max-w-2xl py-8 sm:py-16 lg:py-20">

                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                            Create new account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSignUp} className="space-y-6">

                            {/* Tên */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-100">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-100">
                                    Number phone
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-100">
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
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-100">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Thông báo */}
                            {message && (
                                <p className={`text-center text-sm ${message.startsWith('Lỗi') ? 'text-red-400' : 'text-green-400'}`}>
                                    {message}
                                </p>
                            )}

                            {/* Nút Submit */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.email || !formData.password}
                                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Please wait...' : 'Sign up'}
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/signin" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
                                Sign in
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
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                />
            </div>
        </div>
    )
}

export default AuthSignUp