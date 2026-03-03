import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

const HomeWrapper = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User detected from prop, redirecting to Community...");
      navigate("/community", { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  return <Home />;
};

export default HomeWrapper;
