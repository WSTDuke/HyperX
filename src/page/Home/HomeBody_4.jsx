import React from 'react'
import { Link } from 'react-router-dom'

const HomeBody_4 = () => {
    return (
        <div className="relative isolate overflow-hidden h-screen flex items-center justify-center bg-[#020205] border-t border-white/5 backdrop-blur-3xl">
            
            {/* --- BACKGROUND EFFECTS --- */}
            
            {/* A. CYAN SPOTLIGHT */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-cyan-500/20 blur-[150px] rounded-b-full pointer-events-none -z-10 animate-pulse duration-[4000ms]"></div>

            {/* B. Grid & Gradient Pattern */}
            <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-20 h-[100rem] w-[100rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-40 animate-[spin_60s_linear_infinite]"
                aria-hidden="true"
            >
                <circle cx={512} cy={512} r={512} fill="url(#gradient-cta-cyan)" fillOpacity="0.3" />
                <defs>
                    <radialGradient id="gradient-cta-cyan">
                        <stop stopColor="#06b6d4" /> {/* Cyan */}
                        <stop offset={1} stopColor="#3b82f6" /> {/* Blue */}
                    </radialGradient>
                </defs>
            </svg>

            {/* --- NỘI DUNG CHÍNH --- */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
                
                <h2 className="text-5xl font-black tracking-tighter text-white sm:text-8xl mb-10 leading-[0.85]">
                    READY TO <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-cyan-500">
                        LAUNCH?
                    </span>
                </h2>
                
                <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-gray-500 font-medium">
                    Stop wrestling with legacy distribution. Focus on your code. We handle the planetary-scale deployment.
                </p>
                
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8">
                    {/* Primary Button */}
                    <Link
                        to="/product"
                        className="group relative bg-white px-12 py-5 text-lg font-black text-black shadow-[0_0_50px_-10px_rgba(6,182,212,0.6)] hover:shadow-[0_0_80px_-15px_rgba(6,182,212,0.8)] hover:scale-110 active:scale-95 transition-all duration-500 uppercase tracking-tighter rounded-2xl"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />
                        Initialize Node
                    </Link>
                    
                    {/* Secondary Button */}
                    <Link to="/docs" className="group text-sm font-black leading-6 text-gray-500 flex items-center gap-2 hover:text-white transition-all uppercase tracking-[0.3em]">
                        Establish Contact <span aria-hidden="true" className="group-hover:translate-x-3 transition-transform duration-500 text-cyan-500">→</span>
                    </Link>
                </div>

                {/* System Status Indicator */}
                <div className="mt-24 flex items-center justify-center gap-4 opacity-30 group">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500"></div>
                    <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-[0.5em]">Global Relay Active</span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500"></div>
                </div>
            </div>
        </div>
    )
}

export default HomeBody_4