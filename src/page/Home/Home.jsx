// Home.jsx
import ScrollToTopButton from '../enhancements/ScrollToTopButton'
import HomeBody_4 from './HomeBody_4'
import HomeBody_1 from './HomeBody_1'
import HomeBody_2 from './HomeBody_2'
import HomeBody_3 from './HomeBody_3'
// Import component mới
import FadeInOnScroll from '../enhancements/FadeInOnScroll' 

export default function Home() {
    return (
        <div className="bg-gray-900">
            {/* HomeBody_1 thường là phần tử đầu tiên nên không cần hiệu ứng */}
            <HomeBody_1 /> 
            
            {/* Các phần tử từ từ hiện ra khi cuộn */}
            <FadeInOnScroll>
                <HomeBody_2 />
            </FadeInOnScroll>

            <FadeInOnScroll delay={200}> {/* Thêm delay cho hiệu ứng mượt hơn */}
                <HomeBody_3 />
            </FadeInOnScroll>

            <FadeInOnScroll duration={800}> {/* Tùy chỉnh tốc độ khác */}
                <HomeBody_4 />
            </FadeInOnScroll>
            
            <ScrollToTopButton />
        </div>
    )
}