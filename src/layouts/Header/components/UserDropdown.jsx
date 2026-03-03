import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import {
  UserIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import UserAvatar from "../../../components/UserAvatar";

const UserDropdown = ({ isOpen, dropdownRef, user, onLogout }) => {
  const menuItems = [
    {
      label: "Profile",
      href: `/profile/${user?.id}`,
      icon: UserIcon,
      color: "text-cyan-400",
    },
    {
      label: "Settings",
      href: "/setting",
      icon: Cog6ToothIcon,
      color: "text-blue-400",
    },
    {
      label: "Help & Support",
      href: "/help-support",
      icon: QuestionMarkCircleIcon,
      color: "text-green-400",
    },
  ];

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div
        ref={dropdownRef}
        className="absolute right-0 top-14 w-64 bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="md" className="w-12 h-12" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.raw_user_meta_data?.full_name || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="p-2 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-400" />
            <span className="text-sm font-semibold text-gray-300 group-hover:text-red-400">
              Logout
            </span>
          </button>
        </div>
      </div>
    </Transition>
  );
};

export default UserDropdown;
