import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LazyLoading from "../page/enhancements/LazyLoading";
import NeedAuthModal from "../components/NeedAuthModal";

const PrivateRoute = ({ user: propUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  if (propUser) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#020205] relative overflow-hidden flex items-center justify-center">
      {}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-900/10 rounded-full blur-[120px]"></div>
      </div>

      <NeedAuthModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate("/");
        }}
      />
    </div>
  );
};

export default PrivateRoute;
