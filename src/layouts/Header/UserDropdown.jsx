import { Link } from "react-router-dom";
import UserAvatar from "../../components/UserAvatar";
import { UserIcon, QuestionMarkCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

export const UserDropdown = ({
  user,
  safeUserName,
  safeUserEmail,
  dropdownOpen,
  setDropdownOpen,
  handleLogout
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <div className="relative">
          <UserAvatar
            user={user}
            size="sm"
            disableLink={true}
            className="ring-2 ring-transparent group-hover:ring-cyan-500/20"
          />
        </div>
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-64 rounded-2xl bg-[#0B0D14] border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150 ring-1 ring-white/5">
          <div className="px-5 py-4 border-b border-white/5 bg-white/5">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
              Account
            </p>
            <div className="flex items-center gap-3">
              <UserAvatar
                user={user}
                size="md"
                disableLink={true}
                className="border border-cyan-500/50"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">
                  {safeUserName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {safeUserEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-1">
            <Link
              to={`/profile/${user?.id}`}
              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg gap-3 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <UserIcon className="w-4.5 h-4.5 text-gray-500" />{" "}
              Profile
            </Link>
            <Link
              to="/support"
              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg gap-3 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <QuestionMarkCircleIcon className="w-4.5 h-4.5 text-gray-500" />{" "}
              Help & Support
            </Link>
            <Link
              to="/setting"
              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg gap-3 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <Cog6ToothIcon className="w-4.5 h-4.5 text-gray-500" />{" "}
              Settings
            </Link>
          </div>

          <div className="p-2 border-t border-white/5 bg-white/[0.02]">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg gap-3 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4.5 h-4.5" />{" "}
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
