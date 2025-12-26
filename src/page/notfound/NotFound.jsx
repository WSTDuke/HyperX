import { Link } from 'react-router-dom'
import { ArrowLeft, LifeBuoy } from 'lucide-react'

const NotFound = () => {
    return (
        <div className="relative isolate bg-[#05050A] min-h-screen overflow-hidden flex flex-col justify-center font-sans">
            
            {/* 1. AMBIENT BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            
            {/* Large Glowing "404" Background Overlay */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 select-none">
                <span className="text-[25rem] md:text-[40rem] font-black text-cyan-500/[0.02] blur-[2px] leading-none tracking-tighter animate-pulse">
                    404
                </span>
            </div>

            {/* Top Atmospheric Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />

            {/* MAIN CONTENT AREA */}
            <div className="mx-auto max-w-4xl px-6 py-20 relative z-10">
                <div className="text-center">
                    {/* Error Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">Error Discovery</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6">
                        Lost in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Space.</span>
                    </h1>
                    
                    <p className="mt-6 text-lg md:text-xl leading-relaxed text-gray-400 max-w-xl mx-auto opacity-80 font-medium">
                        The resource you're navigating to seems to have drifted beyond our core infrastructure. Verify the path or return to safety.
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/"
                            className="group relative px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all active:scale-95 flex items-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <ArrowLeft size={18} className="relative z-10 group-hover:-translate-x-1 transition-transform" />
                            <span className="relative z-10">HyperX Command Center</span>
                        </Link>

                        <Link 
                            to="/support" 
                            className="group flex items-center gap-2.5 text-sm font-bold tracking-widest uppercase text-gray-500 hover:text-cyan-400 transition-colors py-4 px-8"
                        >
                            <LifeBuoy size={18} className="group-hover:rotate-45 transition-transform" />
                            Relay to Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Decorator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/5 font-mono text-[10px] tracking-[1em] uppercase">
                <div className="h-px w-20 bg-white/10" />
                HyperX Integrated System
                <div className="h-px w-20 bg-white/10" />
            </div>

            {/* Side Glow Effects */}
            <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-cyan-500/5 rounded-full blur-[100px] -z-10" />
        </div>
    )
}

export default NotFound
