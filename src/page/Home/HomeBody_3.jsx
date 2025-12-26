import React from 'react'

const HomeBody_3 = () => {
    return (
        <div className="py-32 sm:py-48 relative isolate">
            
            {/* LIGHTING: Bottom Radial */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_50rem_at_bottom,theme(colors.cyan.900),transparent)] opacity-10" />
            
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <div className="mb-24 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-black text-cyan-500 mb-6 backdrop-blur-3xl uppercase tracking-widest">
                        <span>02 // Tech Stack</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-white sm:text-7xl leading-[0.9]">
                        BUILT TO <span className="text-cyan-500">SCALE.</span>
                    </h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-2 font-sans">
                    
                    {/* Card 1 */}
                    <BentoCard title="Dynamic Rendering" desc="State-of-the-art UI processing engine." colSpan="lg:row-span-2">
                        <div className="relative min-h-[350px] w-full grow mt-10">
                            <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[2.5rem] border-x border-t border-white/10 bg-[#020205] shadow-2xl group-hover:border-cyan-500/30 transition-colors duration-500">
                                <img src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png" className="size-full object-cover object-top opacity-40 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" alt="" />
                                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020205] to-transparent"></div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Card 2 */}
                    <BentoCard title="Warp Speed" desc="Optimized for 120fps across all platforms." colSpan="max-lg:row-start-1">
                        <div className="flex flex-1 items-center justify-center px-10 py-12 relative overflow-hidden group/img">
                            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-performance.png" className="w-full opacity-60 group-hover:scale-110 transition-transform duration-700 relative z-10" alt="" />
                        </div>
                    </BentoCard>

                    {/* Card 3 */}
                    <BentoCard title="Quantum Guard" desc="Hyper-secure data silos and encryption." colSpan="max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="flex flex-1 items-center px-10 py-10">
                            <img src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png" className="h-[140px] w-full object-contain opacity-60 group-hover:opacity-90 group-hover:rotate-3 transition-all duration-500" alt="" />
                        </div>
                    </BentoCard>

                    {/* Card 4 (APIs) */}
                    <BentoCard title="Hyper APIs" desc="Fully extensible neural endpoints." colSpan="lg:row-span-2">
                        <div className="relative min-h-[350px] w-full grow mt-10">
                             <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-[2rem] bg-[#020205] border-l border-t border-white/10 shadow-2xl group-hover:border-cyan-500/20 transition-all duration-500">
                                <div className="flex bg-white/5 border-b border-white/5 p-3 gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30 animate-pulse"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/30 lg:animate-bounce"></div>
                                </div>
                                <div className="p-8 font-mono text-xs leading-relaxed">
                                    <div className="flex gap-4 mb-2 opacity-40">
                                        <span className="text-gray-600">01</span>
                                        <span className="text-cyan-400">import {'{'} hub {'}'} from "@hyperx/core"</span>
                                    </div>
                                    <div className="flex gap-4 mb-2">
                                        <span className="text-gray-600">02</span>
                                        <span className="text-purple-400">export const</span> <span className="text-blue-400">bridge</span> = <span className="text-purple-400">async</span> () ={'>'} {'{'}
                                    </div>
                                    <div className="flex gap-4 mb-2">
                                        <span className="text-gray-600">03</span>
                                        <span className="text-gray-400">&nbsp;&nbsp;const signal = <span className="text-cyan-400">await</span> hub.listen();</span>
                                    </div>
                                    <div className="flex gap-4 mb-2">
                                        <span className="text-gray-600">04</span>
                                        <span className="text-gray-400">&nbsp;&nbsp;return decode(signal);</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-600">05</span>
                                        <span className="text-gray-500">{'}'}</span>
                                    </div>
                                    <div className="mt-8 flex items-center gap-2">
                                        <div className="w-2 h-4 bg-cyan-500 animate-pulse"></div>
                                        <span className="text-[10px] text-cyan-500/50 uppercase tracking-[0.3em] font-bold">Awaiting Input...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                </div>
            </div>
        </div>
    )
}

const BentoCard = ({ title, desc, children, colSpan = '' }) => (
    <div className={`relative group overflow-hidden rounded-[2.5rem] bg-[#0B0D14]/30 border border-white/5 hover:border-cyan-500/30 transition-all duration-700 hover:shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)] ${colSpan} isolate`}>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
        <div className="relative flex h-full flex-col overflow-hidden">
            <div className="px-10 pt-10">
                <p className="text-2xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors duration-500 uppercase">{title}</p>
                <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-gray-500">{desc}</p>
            </div>
            {children}
        </div>
    </div>
)

export default HomeBody_3