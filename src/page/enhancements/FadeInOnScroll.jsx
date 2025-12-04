// enhancements/FadeInOnScroll.jsx
import React, { useRef, useEffect, useState } from 'react';

const FadeInOnScroll = ({ children, delay = 0, duration = 1000 }) => {
    // 1. useRef để theo dõi DOM element
    const domRef = useRef();
    // 2. useState để theo dõi trạng thái hiển thị
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            // entries[0].isIntersecting là true khi element lọt vào viewport
            if (entries[0].isIntersecting) {
                // Đảm bảo chỉ set Visible một lần
                setVisible(true);
                // Ngừng quan sát sau khi đã hiển thị
                observer.unobserve(domRef.current);
            }
        }, {
            // rootMargin: '0px', 
            // threshold: 0.5, // Có thể chỉnh ngưỡng (ví dụ: 50% element đã lọt vào)
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        // Cleanup: Ngừng quan sát khi component bị hủy
        return () => {
            if (domRef.current) {
                observer.unobserve(domRef.current);
            }
        };
    }, []);

    const style = {
        // Áp dụng độ mờ và hiệu ứng dịch chuyển
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        // Thời gian chuyển đổi (từ props)
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    };

    return (
        <div 
            className="w-full" // Đảm bảo component chiếm đủ chiều rộng
            ref={domRef} 
            style={style}
        >
            {children}
        </div>
    );
};

export default FadeInOnScroll;