import Home from '../page/dashboard/DashboardPage';
import AuthLogin from '../page/auth/AuthLogin';
import NotFound from '../page/NotFound';

const routes = [
    {
        path: "/",
        element: Home,
        exact: true,
        name: "Trang Chủ",
    },
    {
        path: "/login",
        element: AuthLogin,
        private: true,
        name: "Bảng Điều Khiển",
    },

    {
        path: "*",
        element: NotFound,
        private: false,
        name: "Không Tìm Thấy",
    },
];

export default routes;