import { useLocation, Link } from "react-router-dom";
import { EnvelopeOpenIcon } from "@heroicons/react/24/outline"; // Cần cài heroicons nếu chưa có, hoặc dùng icon khác

export default function VerifyPage() {
    const location = useLocation();
    const email = location.state?.email || "";
    const message = location.state?.message || "Please verify your email";

    return (
        <div className="relative isolate flex items-center justify-center min-h-screen px-4 bg-[#05050A] overflow-hidden">

            {/* NOISE & AMBIENT LIGHT */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* CARD */}
            <div className="relative w-full max-w-lg bg-[#0B0D14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center z-10">
                
                {/* Icon Circle */}
                <div className="mx-auto w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-indigo-500/30">
                    {/* SVG Icon thay thế nếu không cài heroicons */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                    Check Your Email
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    {message}
                </p>

                {email && (
                    <div className="bg-white/5 border border-white/10 rounded-lg py-3 px-4 mb-8 inline-block">
                        <span className="text-indigo-300 font-medium">{email}</span>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Link
                        to="/signin"
                        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all active:scale-[0.98]"
                    >
                        Go to Sign In
                    </Link>
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-300 py-2 transition-colors">
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}