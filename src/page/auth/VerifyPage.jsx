import { useLocation, Link } from "react-router-dom";

export default function VerifyPage() {
    const location = useLocation();
    const email = location.state?.email || '';
    const message = location.state?.message || 'Please verify your email';

    return (
        <div className="relative isolate px-6 pt-6 lg:px-8 bg-gray-900 min-h-screen">
            <div className="mx-auto max-w-2xl py-32 sm:py-48">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Check Your Email
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        {message}
                    </p>
                    {email && (
                        <p className="mt-2 text-sm text-gray-400">
                            We sent a confirmation link to <span className="font-semibold text-indigo-400">{email}</span>
                        </p>
                    )}
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            to="/signin"
                            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
                        >
                            Go to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}