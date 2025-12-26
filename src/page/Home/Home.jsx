import React from 'react'
import ScrollToTopButton from '../enhancements/ScrollToTopButton'
import FadeInOnScroll from '../enhancements/FadeInOnScroll' 
import HomeBody_1 from './HomeBody_1'
import HomeBody_2 from './HomeBody_2'
import HomeBody_3 from './HomeBody_3'
import HomeBody_4 from './HomeBody_4'

export default function Home() {
    return (
        <div className="bg-[#020205] min-h-screen w-full relative overflow-y-hidden overflow-x-hidden selection:bg-cyan-500/30">
            
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-0 w-[40rem] h-[40rem] bg-blue-500/[0.02] rounded-full blur-[150px] pointer-events-none -z-10"></div>

            {/* Content chính */}
            <div className="relative z-10">
                <HomeBody_1 /> 
                
                <FadeInOnScroll>
                    <HomeBody_2 />
                </FadeInOnScroll>

                <FadeInOnScroll delay={200}> 
                    <HomeBody_3 />
                </FadeInOnScroll>

                <FadeInOnScroll duration={800}> 
                    <HomeBody_4 />
                </FadeInOnScroll>
            </div>
            
            {/* Nút Scroll luôn nằm trên cùng */}
            <div className="relative z-[9999]">
                <ScrollToTopButton />
            </div>
        </div>
    )
}