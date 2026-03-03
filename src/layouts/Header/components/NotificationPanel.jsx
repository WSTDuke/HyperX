import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import {
  BellIcon,
  CheckCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import UserAvatar from "../../../components/UserAvatar";

const NotificationPanel = ({
  isOpen,
  panelRef,
  notifications,
  hasSeenNoti,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <HeartIcon className="w-4 h-4 text-red-500" />;
      case "comment":
        return <ChatBubbleLeftIcon className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlusIcon className="w-4 h-4 text-green-500" />;
      default:
        return <BellIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatNotificationTime = (timestamp) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        ref={panelRef}
        className="absolute right-0 top-14 w-96 bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            {!hasSeenNoti && notifications.some((n) => !n.is_read) && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                  !notif.is_read ? "bg-cyan-500/5" : ""
                }`}
              >
                <div className="flex gap-3">
                  <Link
                    to={`/profile/${notif.actor?.id}`}
                    className="flex-shrink-0"
                  >
                    <UserAvatar
                      user={{
                        raw_user_meta_data: {
                          avatar_url: notif.actor?.avatar_url,
                          full_name: notif.actor?.full_name,
                        },
                      }}
                      size="sm"
                      className="w-10 h-10"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notif.type)}
                        <p className="text-sm text-gray-300">
                          <Link
                            to={`/profile/${notif.actor?.id}`}
                            className="font-semibold text-white hover:text-cyan-400"
                          >
                            {notif.actor?.full_name || "Someone"}
                          </Link>{" "}
                          <span className="text-gray-400">{notif.content}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notif.is_read && (
                          <button
                            onClick={() => onMarkAsRead(notif.id)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(notif.id)}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatNotificationTime(notif.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Transition>
  );
};

export default NotificationPanel;
