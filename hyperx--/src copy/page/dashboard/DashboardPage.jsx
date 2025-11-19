import React from 'react'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'

const DashboardPage = () => {
    return (
        <>
            <Navbar />
            <div>
                <section class="hero">
                    <h1>Công cụ phát triển hiện đại cho lập trình viên</h1>
                    <p>JetLike mang đến môi trường phát triển tích hợp (IDE) tối ưu hiệu suất, thông minh và mạnh mẽ — giúp bạn lập
                        trình nhanh hơn, chính xác hơn và hiệu quả hơn.</p>
                    <a href="download.html">Tải ngay</a>
                </section>
                <section class="features">
                    <div class="feature">
                        <h3>Đa nền tảng</h3>
                        <p>Chạy mượt mà trên Windows, macOS và Linux, giúp bạn linh hoạt làm việc ở mọi nơi.</p>
                    </div>
                    <div class="feature">
                        <h3>Tích hợp thông minh</h3>
                        <p>Tự động gợi ý mã, phát hiện lỗi theo thời gian thực và hỗ trợ debug mạnh mẽ.</p>
                    </div>
                    <div class="feature">
                        <h3>Hiệu suất vượt trội</h3>
                        <p>Được tối ưu để khởi động nhanh, phản hồi tốt và xử lý dự án lớn mượt mà.</p>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    )
}

export default DashboardPage
