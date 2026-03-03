import { Link, NavLink, useLocation } from "react-router-dom";

export const NavigationLinks = ({ navigation, user, setIsAuthModalOpen }) => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:gap-x-2 relative items-center">
      {navigation.map((item) => (
        <div key={item.name} className="relative group">
          <NavLink
            to={item.href}
            onClick={(e) => {
              if (!user && item.private) {
                e.preventDefault();
                setIsAuthModalOpen(true);
              } else if (
                location.pathname === "/community" &&
                item.href === "community"
              ) {
                window.dispatchEvent(
                  new CustomEvent("hyperx-refresh-community")
                );
              }
            }}
            className="relative px-6 py-4 flex items-center transition-all duration-300"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-cyan-400"
                  }`}
                >
                  {item.name}
                </span>
                <span
                  className={`absolute bottom-2 left-6 right-6 h-[2px] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)] transition-all duration-500 ${
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-70 group-hover:scale-x-100"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
        </div>
      ))}
    </div>
  );
};
