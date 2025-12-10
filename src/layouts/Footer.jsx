import { FacebookIcon, GithubIcon, Instagram, InstagramIcon, TwitterIcon } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <footer className="relative bg-[#0f111a] text-gray-400 border-t border-gray-800 overflow-hidden">
            {/* Background Logo watermark */}
            <div className="absolute -bottom-10 -right-10 select-none opacity-5 pointer-events-none">
                 <span className="text-[15rem] font-bold text-white">HX</span>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <span className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-500 bg-clip-text text-transparent">
                            HyperX
                        </span>
                        <p className="text-sm leading-6 text-gray-400 max-w-xs">
                            Empowering developers to build the future, one line of code at a time.
                        </p>
                        <div className="flex space-x-6">
                            {/* Social Placeholders - có thể thêm icon thật vào đây */}
                            <a href="https://www.facebook.com/duke7925" className="text-gray-500 hover:text-white transition-colors"><FacebookIcon /></a>
                            <a href="https://www.instagram.com/duke.nd_/" className="text-gray-500 hover:text-white transition-colors"><InstagramIcon /></a>
                            <a href="https://github.com/dukeWst" className="text-gray-500 hover:text-white transition-colors"><GithubIcon /></a>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Solutions</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Marketing</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Analytics</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Commerce</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Insights</a></li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Submit ticket</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Documentation</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">API Status</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">About</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Blog</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Jobs</a></li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Privacy</a></li>
                                    <li><a href="#" className="text-sm leading-6 hover:text-indigo-400 transition-colors">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-gray-800 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-gray-500">&copy; 2025 HyperX, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer