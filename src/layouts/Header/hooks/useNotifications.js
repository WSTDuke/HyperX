import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../../routes/supabaseClient";

export const useNotifications = (user) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasSeenNoti, setHasSeenNoti] = useState(false);
  const prevUnreadCount = useRef(0);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from("notifications")
        .select("*, actor:actor_id(id, full_name, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) setNotifications(data);

      const { count: fetchedUnreadCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      const finalCount = fetchedUnreadCount || 0;
      setUnreadCount(finalCount);

      const lastSeen = parseInt(
        localStorage.getItem("hyperx_last_seen_count") || "0",
        10,
      );
      setHasSeenNoti(finalCount === lastSeen);
      prevUnreadCount.current = finalCount;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notiId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notiId ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notiId);
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  };

  const handleDeleteNotification = async (notiId) => {
    const notification = notifications.find((n) => n.id === notiId);
    setNotifications((prev) => prev.filter((n) => n.id !== notiId));
    if (notification && !notification.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    await supabase.from("notifications").delete().eq("id", notiId);
  };

  const handleClearAll = async () => {
    if (!user?.id) return;

    setNotifications([]);
    setUnreadCount(0);

    await supabase.from("notifications").delete().eq("user_id", user.id);
  };

  const markNotificationsAsSeen = () => {
    localStorage.setItem("hyperx_last_seen_count", String(unreadCount));
    setHasSeenNoti(true);
  };

  return {
    notifications,
    unreadCount,
    hasSeenNoti,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllRead,
    handleDeleteNotification,
    handleClearAll,
    markNotificationsAsSeen,
  };
};
