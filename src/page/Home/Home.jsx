import React from 'react'
import ScrollToTopButton from '../enhancements/ScrollToTopButton'
import FadeInOnScroll from '../enhancements/FadeInOnScroll' 
import HomeBody_1 from './HomeBody_1'
import HomeBody_2 from './HomeBody_2'
import HomeBody_3 from './HomeBody_3'
import HomeBody_4 from './HomeBody_4'

export default function Home() {
    return (
        // MASTER BACKGROUND: #05050A
        // relative: để chứa các thành phần con absolute
        <div className="bg-[#05050A] min-h-screen w-full relative overflow-y-hidden overflow-x-hidden selection:bg-indigo-500/30">
            
            {/* Hiệu ứng noise/grain nhẹ toàn trang (tùy chọn, tạo cảm giác film) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

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