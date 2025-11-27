import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import routes from './routes/config';
import { useEffect, useState, Suspense } from 'react'; // Thêm Suspense
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import { supabase } from './supabaseClient';
import LazyLoading from './LazyLoading';

function AppRoutes({ user }) {
  const location = useLocation();
  const hideHeaderPaths = ['/signin', '/signup', '/verify'];

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header user={user} />}

      {/* Suspense sẽ hiện loading khi chuyển trang nếu bạn dùng React.lazy trong routes/config */}
      <Suspense fallback={<LazyLoading />}>
        <Routes>
          {routes.map((route, index) => {
            const ElementComponent = route.private ? (
              // Truyền user vào ProtectedRoute nếu cần kiểm tra quyền
              <ProtectedRoutee element={route.element} user={user} />
            ) : (
              <route.element />
            );

            return <Route key={index} path={route.path} element={ElementComponent} />;
          })}
        </Routes>
      </Suspense>

      {!hideHeaderPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  // Khởi tạo là true để mặc định vào là hiện Loading ngay
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra session hiện tại
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
      }
      // QUAN TRỌNG: Sau khi kiểm tra xong mới tắt loading
      setIsAuthLoading(false);
    });

    // 2. Lắng nghe thay đổi auth (đăng nhập/đăng xuất)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      // Đảm bảo tắt loading nếu event này bắn ra
      setIsAuthLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Nếu đang check auth (khi vừa reload), hiện Loading component
  // Return này chặn toàn bộ Router render cho đến khi biết user là ai
  if (isAuthLoading) {
    return <LazyLoading />;
  }

  return (
    <Router>
      <AppRoutes user={user} />
    </Router>
  );
}