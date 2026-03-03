import { useEffect, useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import { supabase } from "./routes/supabaseClient";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import LazyLoading from "./page/enhancements/LazyLoading";
import ScrollToTop from "./page/enhancements/ScrollTop";
import ChatBox from "./components/ChatBox";
import { FollowingProvider } from "./context/FollowingContext";

import routes from "./routes/config";
import PrivateRoute from "./routes/PrivateRoute";
import GuestRoute from "./routes/GuestRoute";

function AppRoutes({ user }) {
  const location = useLocation();

  const hideHeaderOn = [
    "/signin",
    "/signup",
    "/verify",
    "/auth/callback",
    "/forgot-password",
    "/update-password",
  ];

  const showHeader = !hideHeaderOn.some((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  const hideFooterOn = [
    ...hideHeaderOn,
    "/chatbot-ai",
    "/community",

    "/",
    "/product",
    "/docs",
    "/create-product",
    "/product/edit/:id",
    "/product/:id",
    "/profile",
    "/profile/:id",
    "/setting",
  ];

  const showFooter = !hideFooterOn.some((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  return (
    <>
      <ScrollToTop />

      {}
      {showHeader && <Header user={user} />}

      <Suspense fallback={<LazyLoading />}>
        <Routes>
          {}
          {routes.map((route, index) => {
            if (!route.private) {
              const element = <route.element user={user} />;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route.guestOnly ? (
                      <GuestRoute user={user}>{element}</GuestRoute>
                    ) : (
                      element
                    )
                  }
                />
              );
            }
            return null;
          })}

          {}
          <Route element={<PrivateRoute user={user} />}>
            {routes.map((route, index) => {
              if (route.private) {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<route.element user={user} />}
                  />
                );
              }
              return null;
            })}
          </Route>
        </Routes>
      </Suspense>

      {showFooter && <Footer />}
      <ChatBox currentUser={user} />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("hyperx_has_booted");
    const MIN_LOAD_TIME = hasBooted ? 0 : 1500;
    const startTime = Date.now();

    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Supabase session error:", error.message);

          if (error.message.includes("Refresh Token")) {
            supabase.auth.signOut();
          }
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

        setTimeout(() => {
          setUser(session?.user || null);
          setIsFadingOut(true);

          if (!hasBooted) {
            sessionStorage.setItem("hyperx_has_booted", "true");
          }

          setTimeout(() => {
            setIsAuthLoading(false);
          }, 1000);
        }, remaining);
      })
      .catch((err) => {
        console.error("Unexpected session error:", err);
        setIsAuthLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else if (_event === "SIGNED_OUT") {
          setUser(null);
        }
        // For USER_UPDATED: session might be null in some Supabase versions,
        // so we call getUser() to always get the latest metadata
        if (_event === "USER_UPDATED") {
          const { data } = await supabase.auth.getUser();
          if (data?.user) setUser(data.user);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Router>
        <FollowingProvider user={user}>
          <AppRoutes user={user} />
        </FollowingProvider>
      </Router>
      {isAuthLoading && (
        <LazyLoading status="Loading..." isExiting={isFadingOut} />
      )}
    </>
  );
}
