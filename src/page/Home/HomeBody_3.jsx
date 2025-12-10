import React from 'react'

const HomeBody_3 = () => {
    return (
        <div className="py-24 sm:py-32 relative isolate">
            
            {/* LIGHTING: Ánh sáng nền nhẹ nhàng từ phía dưới lên để tạo chiều sâu cho Grid */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_40rem_at_bottom,theme(colors.indigo.900),transparent)] opacity-40" />
            
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-4 backdrop-blur-md">
                        <span>Engineering Excellence</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Everything you need to <span className="text-indigo-500">scale</span>.
                    </h2>
                </div>

                <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    
                    {/* Card 1 */}
                    <BentoCard title="Mobile First Design" desc="Responsive layouts that adapt perfectly." colSpan="lg:row-span-2">
                        <div className="relative min-h-[300px] w-full grow mt-8">
                            <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-2xl border-x border-t border-white/10 bg-[#0B0D14] shadow-2xl">
                                <img src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png" className="size-full object-cover object-top opacity-70 group-hover:opacity-100 transition-opacity duration-500" alt="" />
                            </div>
                        </div>
                    </BentoCard>

                    {/* Card 2 */}
                    <BentoCard title="Lightning Performance" desc="Optimized rendering engine." colSpan="max-lg:row-start-1">
                        <div className="flex flex-1 items-center justify-center px-8 py-8">
                            <img src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-performance.png" className="w-full opacity-80 group-hover:scale-105 transition-transform duration-500" alt="" />
                        </div>
                    </BentoCard>

                    {/* Card 3 */}
                    <BentoCard title="Enterprise Security" desc="Bank-grade encryption." colSpan="max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="flex flex-1 items-center px-8 py-6">
                            <img src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png" className="h-[120px] w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                        </div>
                    </BentoCard>

                    {/* Card 4 (APIs) */}
                    <BentoCard title="Powerful APIs" desc="Extensible endpoints." colSpan="lg:row-span-2">
                        <div className="relative min-h-[300px] w-full grow">
                             <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-[#0B0D14] ring-1 ring-white/10 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500">
                                <div className="flex bg-white/5 border-b border-white/5 p-2 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                </div>
                                <div className="p-6 font-mono text-xs text-gray-400 leading-relaxed">
                                    <span className="text-purple-400">export const</span> <span className="text-blue-400">handler</span> = <span className="text-purple-400">async</span> (req) ={'>'} {'{'} <br/>
                                    &nbsp;&nbsp;<span className="text-purple-400">const</span> data = <span className="text-yellow-300">db.query</span>();<br/>
                                    &nbsp;&nbsp;<span className="text-slate-600">// Processing...</span><br/>
                                    &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-green-400">json</span>(data);<br/>
                                    {'}'}
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                </div>
            </div>
        </div>
    )
}

// Component con để đồng bộ Style Bento Card
const BentoCard = ({ title, desc, children, colSpan = '' }) => (
    <div className={`relative group overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)] ${colSpan}`}>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
        <div className="relative flex h-full flex-col overflow-hidden">
            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">{title}</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-400">{desc}</p>
            </div>
            {children}
        </div>
    </div>
)

export default HomeBody_3