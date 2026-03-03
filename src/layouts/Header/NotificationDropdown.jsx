import { BellIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import UserAvatar from "../../components/UserAvatar";
import { getNotiIcon, getNotiContent } from "../../utils/notificationHelpers";
import { useEffect, useRef } from "react";

export const NotificationDropdown = ({
  notifications,
  unreadCount,
  hasSeenNoti,
  notiOpen,
  setNotiOpen,
  setHasSeenNoti,
  handleReadNotification,
  handleMarkAllRead,
  openDeleteModal
}) => {
  const notiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setNotiOpen]);

  return (
    <div className="relative" ref={notiRef}>
      <button
        onClick={() => {
          setNotiOpen(!notiOpen);
          setHasSeenNoti(true);
          localStorage.setItem(
            "hyperx_last_seen_count",
            unreadCount.toString()
          );
        }}
        className={`relative p-2.5 rounded-full transition-all duration-200 group ${
          notiOpen ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <BellIcon className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
        {unreadCount > 0 && !hasSeenNoti && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#05050A] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notiOpen && (
        <div className="absolute right-0 mt-4 w-96 rounded-2xl bg-[#0B0D14] border border-white/10 shadow-2xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in duration-200 ring-1 ring-white/5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <CheckCircleIcon className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#0B0D14]">
            {notifications.length > 0 ? (
              notifications.map((noti) => (
                <div
                  key={noti.id}
                  onClick={() => handleReadNotification(noti)}
                  className={`flex gap-4 px-5 py-4 cursor-pointer transition-colors border-b border-white/5 last:border-0 relative hover:bg-white/5
                                                  ${!noti.is_read ? "bg-cyan-500/5" : ""}`}
                >
                  {!noti.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                  )}

                  <div className="flex-shrink-0 mt-1">
                    <div className="relative">
                      <UserAvatar user={noti.actor} size="sm" />
                      <div className="absolute -bottom-1 -right-1 bg-[#0B0D14] rounded-full p-0.5 border border-gray-800">
                        {getNotiIcon(noti.type)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 leading-snug">
                      {getNotiContent(noti)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1.5 font-medium">
                      {new Date(noti.created_at).toLocaleDateString("en-US")} •{" "}
                      {new Date(noti.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
                <BellIcon className="w-12 h-12 opacity-10" />
                <p className="text-sm font-medium">No notifications yet</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="bg-[#0B0D14] p-2 border-t border-white/5">
              <button
                onClick={() => {
                  setNotiOpen(false);
                  openDeleteModal();
                }}
                className="w-full py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <TrashIcon className="w-3.5 h-3.5" /> Clear All History
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
