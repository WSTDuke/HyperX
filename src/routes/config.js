import { lazy } from 'react';

// ... Các import cũ giữ nguyên ...
import AuthSignIn from '../page/auth/AuthSignIn';
import AuthSignUp from '../page/auth/AuthSignUp';
import NotFound from '../page/notfound/NotFound'
import VerifyPage from '../page/auth/VerifyPage'
import AuthCallback from '../page/auth/AuthCallback';
import Product from '../page/product/page/Product';
import NewProduct from '../page/product/page/NewProduct';

// Import ProductDetail
import ProductDetail from '../page/product/page/ProductDetail'; 

import DocsPage from '../page/docs/Docs';
import Setting from '../page/setting/Setting';
import Community from '../page/community/CommunityPage';
import UserProfile from '../page/profile/UserProfile';
import PostDetail from '../page/community/PostDetail';

// --- BỔ SUNG: HÀM DELAY IMPORT ---
/**
 * Tạo một hàm lazy load với độ trễ tối thiểu (minimum delay)
 * @param {function} factory Hàm import() component
 * @param {number} delay_ms Thời gian delay tối thiểu tính bằng mili giây (ms)
 * @returns {Promise<object>}
 */
const delayImport = (factory, delay_ms) => {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        factory().then((module) => {
            const timeElapsed = Date.now() - startTime;
            const remainingDelay = delay_ms - timeElapsed;
            
            if (remainingDelay > 0) {
                // Nếu thời gian tải quá nhanh, chờ nốt phần còn lại của delay
                setTimeout(() => resolve(module), remainingDelay);
            } else {
                // Nếu thời gian tải đã vượt quá delay, resolve ngay lập tức
                resolve(module);
            }
        });
    });
};

// Đặt độ trễ tối thiểu là 500ms (0.5 giây)
const MINIMUM_LOAD_DELAY = 500; 

// --- CẬP NHẬT CÁCH LAZY LOAD CHATBOT VÀ CÁC COMPONENT KHÁC ---
const Home = lazy(() => delayImport(() => import('../page/Home/Home'), MINIMUM_LOAD_DELAY));
const ChatbotAIPage = lazy(() => delayImport(
    () => import('../page/chatbotAI/ChatbotAI'), 
    MINIMUM_LOAD_DELAY
));

const routes = [
    {
        path: "/",
        element: Home,
        exact: true,
        name: "Trang Chủ",
    },
    {
        path: "/home",
        element: Home,
        exact: true,
        name: "Trang Chủ",
    },
    // -----------------------------------------------------------
    {
        path: "/signin",
        element: AuthSignIn,
        private: false,
        name: "Đăng Nhập",
    },
    {
        path: "/signup",
        element: AuthSignUp,
        private: false,
        name: "Đăng ký",
    },
    {
        path: "/verify",
        element: VerifyPage,
        name: "Xác thực",
    },
    {
        path: "/auth/callback",
        element: AuthCallback,
        name: "Xác thực người dùng",
    },
    // -----------------------------------------------------------
    
    // === PHẦN PROFILE (Cần 2 routes) ===
    {
        path: "/profile",
        element: UserProfile,
        private: true,
        name: "Trang cá nhân",
    },
    {
        path: "/profile/:id",
        element: UserProfile,
        private: true,
        name: "Trang cá nhân người dùng",
    },

    // -----------------------------------------------------------
    {
        path: "/product",
        element: Product,
        private: true,
        name: "Sản phẩm",
    },
    {
        path: "/create-product", 
        element: NewProduct,
        private: true,
        name: "Thêm sản phẩm",
    },
    
    {
        path: "/product/edit/:id", 
        element: NewProduct,        
        private: true,
        name: "Sửa sản phẩm",
    },

    {
        path: "/product/:id", 
        element: ProductDetail,     
        private: true,
        name: "Chi tiết sản phẩm",
    },

    // -----------------------------------------------------------
    {
        path: "/docs",
        element: DocsPage, 
        name: "Tài liệu",
    },
    // -----------------------------------------------------------
    {
        path: "/chatbot-ai",
        element: ChatbotAIPage, 
        name: "Chatbot AI",
    },
    // -----------------------------------------------------------
    {
        path: "/setting",
        element: Setting, 
        private: true,
        name: "Cài đặt",
    },
    // -----------------------------------------------------------
    {
        path: "/community",
        element: Community,
        private: true,
        name: "Cộng đồng",
    },
    {
        path: "/post/:id",  // Đường dẫn chi tiết bài viết
        element: PostDetail,
        private: true,      // Yêu cầu đăng nhập mới xem được (tùy bạn chọn)
        name: "Chi tiết bài viết",
    },
    // -----------------------------------------------------------
    {
        path: "*",
        element: NotFound,
        private: false,
        name: "Không Tìm Thấy",
    },
];

export default routes;