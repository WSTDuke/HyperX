import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import routes from './routes/config';
import { useEffect, useState, Suspense } from 'react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import { supabase } from './supabaseClient';
import LazyLoading from './LazyLoading';
import ScrollToTop from './ScrollTop';
import AuthSignIn from './page/auth/AuthSignIn';

// Bạn cần đảm bảo ProtectedRoutee được định nghĩa đúng cách 
// và truyền prop user xuống cho component con.
const ProtectedRoutee = ({ element: Element, user, ...rest }) => {
  // Logic bảo vệ route, ví dụ:
  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng đến /signin
    // Cần import Navigate từ react-router-dom
    // return <Navigate to="/signin" replace />; 
    return <Navigate to="/signin" replace />;
  }
  return <Element user={user} {...rest} />;
};


function AppRoutes({ user }) {
  const location = useLocation();
  const hideHeaderPaths = ['/signin', '/signup', '/verify'];

  return (
    <>
      <ScrollToTop />
      {!hideHeaderPaths.includes(location.pathname) && <Header user={user} />}

      <Suspense fallback={<LazyLoading />}>
        <Routes>
          {routes.map((route, index) => {
            // FIX: Đảm bảo truyền prop user cho Profile component 
            // dù nó là private hay public route, nếu nó cần prop đó.
            const ElementComponent = route.private ? (
              // Với route private, user được truyền qua ProtectedRoutee
              <ProtectedRoutee element={route.element} user={user} />
            ) : (
              // VỚI CÁC ROUTE PUBLIC (ví dụ: Profile là public):
              // Nếu route.element chính là Profile component, nó cần được truyền user
              // Tuy nhiên, vì chúng ta không biết routes.js, đây là một điểm cần lưu ý.
              // Nếu component Profile cần prop user, bạn phải truyền nó ở đây!
              // Giả sử component Profile là một route public cần user:
              route.path === '/profile'
                ? <route.element user={user} /> // Nếu là Profile, truyền user
                : <route.element /> // Các component khác không cần user
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Chỉ lắng nghe thay đổi auth (Listener này sẽ bắn ra sự kiện đầu tiên
    // để xác định trạng thái user ngay khi component mount, thay thế cho getSession)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // 1. Cập nhật user state
      setUser(session?.user || null);

      // 2. Đảm bảo tắt loading sau khi nhận được trạng thái auth đầu tiên
      // (Ngay cả khi session là null, auth state đã được xác định xong)
      setIsAuthLoading(false);
    });

    // Cleanup
    return () => listener.subscription.unsubscribe();
  }, []);

  // Nếu đang check auth (khi vừa reload), hiện Loading component
  if (isAuthLoading) {
    // Sử dụng LazyLoading với status để thân thiện hơn
    return <LazyLoading status="Checking user session..." />;
  }

  return (
    <Router>
      <AppRoutes user={user} />
    </Router>
  );
}