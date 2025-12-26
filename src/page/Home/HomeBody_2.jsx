import React from 'react'
// Đảm bảo đường dẫn ảnh đúng với project của bạn
import IMGgame from '../../assets/OIP.webp'
import IMGapp from '../../assets/mexicanas-580x385.jpg'
import IMGfinance from '../../assets/banking-symbol-financial-system-icon-circulation-vector-2500843-15654281304022058063886-crop-15654281627291067117848-crop-1565428177047472866763.jpg'
import IMGconnect from '../../assets/OIP (1).webp'

const HomeBody_2 = () => {
    return (
        <div className="relative isolate py-32 lg:py-48">
            
            {/* LIGHTING: Side Glows */}
            <div className="absolute top-1/2 -left-64 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute top-1/2 -right-64 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center font-sans">
                    
                    {/* Text Content */}
                    <div className="lg:pr-8">
                        <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-black text-cyan-500 mb-8 backdrop-blur-3xl uppercase tracking-widest">
                            <span>01 // Global Connectivity</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter text-white sm:text-7xl mb-8 leading-[0.9]">
                            REDEFINING <br/> INTERACTION.
                        </h2>
                        <p className="text-xl leading-relaxed text-gray-500 mb-10 border-l-2 border-cyan-500/50 pl-8 font-medium italic">
                            "We are not just building apps; we are weaving the digital fabric of tomorrow." 
                            <span className="block mt-4 not-italic text-sm text-gray-600 uppercase tracking-widest font-bold">— HyperX Core Manifesto</span>
                        </p>
                        
                        <div className="grid grid-cols-3 gap-12 border-t border-white/5 pt-12">
                            {[
                                { val: '50M+', label: 'Nodes' },
                                { val: '99.9%', label: 'Stability' },
                                { val: '24/7', label: 'Uplink' }
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <h3 className="text-3xl font-black text-white tracking-tighter">{stat.val}</h3>
                                    <p className="text-[10px] text-cyan-500/60 mt-2 uppercase tracking-[0.2em] font-mono font-bold">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Grid - Glass Style */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] -z-10 opacity-30"></div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6 pt-16">
                                <CardImage src={IMGgame} alt="Gaming" height="h-56" />
                                <CardImage src={IMGapp} alt="App" height="h-72" />
                            </div>
                            <div className="space-y-6">
                                <CardImage src={IMGfinance} alt="Finance" height="h-72" />
                                <CardImage src={IMGconnect} alt="Connect" height="h-56" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CardImage = ({ src, alt, height }) => (
    <div className={`relative overflow-hidden rounded-[2rem] bg-[#0B0D14]/40 border border-white/5 shadow-2xl hover:scale-[1.05] hover:border-cyan-500/30 transition-all duration-700 group cursor-crosshair`}>
        <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay group-hover:bg-cyan-500/0 transition-colors z-10"></div>
        <img src={src} alt={alt} className={`${height} w-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out`} />
        <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Data Stream Active
            </div>
        </div>
    </div>
)

export default HomeBody_2