// src/components/LazyLoading.jsx
import React from 'react';

const LazyLoading = ({ status = "Loading..." }) => {
    return (
        // 1. Z-Index cực cao (10000) để đè lên tất cả
        // 2. Nền #05050A để đồng bộ với Home
        <div className="fixed inset-0 flex items-center justify-center bg-[#05050A] z-[10000]">
            
            {/* --- BACKGROUND EFFECTS --- */}
            {/* Ánh sáng nền nhẹ nhàng để không bị đen kịt nhàm chán */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative flex flex-col items-center gap-6">
                
                {/* --- SPINNER CAO CẤP (Double Glow Ring) --- */}
                <div className="relative flex items-center justify-center">
                    {/* Vòng ngoài: Indigo - Xoay nhanh */}
                    <div className="absolute animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                    
                    {/* Vòng trong: Purple - Xoay ngược hoặc chậm hơn (dùng animation-delay hoặc opacity) */}
                    <div className="absolute animate-pulse rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 opacity-70"></div>
                    
                    {/* Logo hoặc Dot ở giữa (Tùy chọn) */}
                    <div className="h-4 w-4 bg-white rounded-full shadow-[0_0_15px_white] animate-ping"></div>
                </div>

                {/* --- TEXT STATUS --- */}
                {/* Hiệu ứng chữ nhấp nháy nhẹ (Pulse) + Gradient */}
                <p className="text-lg font-bold tracking-widest uppercase animate-pulse bg-clip-text mt-8 text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                    {status}
                </p>
            </div>
        </div>
    );
};

export default LazyLoading;