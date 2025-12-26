import { FacebookIcon, GithubIcon, Instagram, InstagramIcon, TwitterIcon } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <footer className="relative bg-[#020205] text-gray-400 border-t border-white/5 overflow-hidden isolate">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[150px] -mr-64 -mt-32"></div>
            </div>

            {/* Background Logo watermark */}
            <div className="absolute -bottom-20 -right-20 select-none opacity-[0.02] pointer-events-none">
                 <span className="text-[25rem] font-black text-white leading-none tracking-tighter">HX</span>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28 relative z-10">
                <div className="xl:grid xl:grid-cols-3 xl:gap-16">
                    <div className="space-y-10">
                        <div className="flex flex-col gap-2">
                            <span className="text-4xl font-black bg-gradient-to-br from-white via-white to-cyan-500 bg-clip-text text-transparent tracking-tighter uppercase">
                                HyperX
                            </span>
                            <span className="text-[10px] font-mono font-bold text-cyan-500/60 uppercase tracking-[0.4em] ml-1">Universal Tech Hub</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-500 max-w-xs font-medium">
                            The ultimate destination for tech enthusiasts, developers, and pioneers of the digital frontier.
                        </p>
                        <div className="flex space-x-5">
                            <a href="https://www.facebook.com/duke7925" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/20 transition-all duration-300 group">
                                <FacebookIcon size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.instagram.com/duke.nd_/" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/20 transition-all duration-300 group">
                                <InstagramIcon size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://github.com/dukeWst" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/20 transition-all duration-300 group">
                                <GithubIcon size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-12 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-12">
                            <div>
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 font-mono">Ecosystem</h3>
                                <ul role="list" className="space-y-5">
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Community</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>App Store</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Dev Center</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>AI Assistant</a></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 font-mono">Resources</h3>
                                <ul role="list" className="space-y-5">
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Guide</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>API Status</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Releases</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-12">
                            <div>
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 font-mono">Platform</h3>
                                <ul role="list" className="space-y-5">
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>About</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Contact</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Partners</a></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 font-mono">Legal</h3>
                                <ul role="list" className="space-y-5">
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Transparency</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Privacy</a></li>
                                    <li><a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 group-hover:scale-150 transition-all"></div>Terms</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-20 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs leading-5 text-gray-600 font-mono font-bold uppercase tracking-widest">&copy; 2025 HyperX Universal. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="text-[10px] text-cyan-500/40 font-mono uppercase tracking-widest">v2.4.0 Stable</span>
                        <span className="text-[10px] text-gray-700 font-mono uppercase tracking-widest">Built with Passion</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer