import AuthSignIn from '../page/auth/AuthSignIn';
import AuthSignUp from '../page/auth/AuthSignUp';
import Home from '../page/dashboard/DashboardPage';
import NotFound from '../page/notfound/NotFound'
import VerifyPage from '../page/auth/VerifyPage'
import AuthCallback from '../page/auth/AuthCallback';

const routes = [
    {
        path: "/",
        element: Home,
        exact: true,
        name: "Trang Chủ",
    },

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

    // Not found
    {
        path: "*",
        element: NotFound,
        private: false,
        name: "Không Tìm Thấy",
    },
];

export default routes;