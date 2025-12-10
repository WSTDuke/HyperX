import React from 'react'
// Đảm bảo đường dẫn ảnh đúng với project của bạn
import IMGgame from '../../assets/OIP.webp'
import IMGapp from '../../assets/mexicanas-580x385.jpg'
import IMGfinance from '../../assets/banking-symbol-financial-system-icon-circulation-vector-2500843-15654281304022058063886-crop-15654281627291067117848-crop-1565428177047472866763.jpg'
import IMGconnect from '../../assets/OIP (1).webp'

const HomeBody_2 = () => {
    return (
        <div className="relative isolate">
            
            {/* LIGHTING: 2 Bên hông (Side Glows) */}
            {/* Trái: Indigo */}
            <div className="absolute top-1/2 -left-64 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
            {/* Phải: Purple */}
            <div className="absolute top-1/2 -right-64 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Text Content */}
                    <div className="lg:pr-8">
                        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-6 backdrop-blur-md">
                            <span>Global Connectivity</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                            Redefining Human Interaction.
                        </h2>
                        <p className="text-lg leading-8 text-gray-400 mb-8 border-l-2 border-indigo-500 pl-6">
                            We are not just building apps; we are weaving the digital fabric of tomorrow. From finance to entertainment, experience seamless integration across all your devices.
                        </p>
                        
                        <div className="flex gap-8 border-t border-white/10 pt-8">
                            {[
                                { val: '50M+', label: 'Users' },
                                { val: '99.9%', label: 'Uptime' },
                                { val: '24/7', label: 'Support' }
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Grid - Glass Style */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <CardImage src={IMGgame} alt="Gaming" height="h-48" />
                                <CardImage src={IMGapp} alt="App" height="h-64" />
                            </div>
                            <div className="space-y-4">
                                <CardImage src={IMGfinance} alt="Finance" height="h-64" />
                                <CardImage src={IMGconnect} alt="Connect" height="h-48" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Component con để tái sử dụng style ảnh Glassmorphism
const CardImage = ({ src, alt, height }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500 group`}>
        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay group-hover:bg-indigo-500/0 transition-colors"></div>
        <img src={src} alt={alt} className={`${height} w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
)

export default HomeBody_2