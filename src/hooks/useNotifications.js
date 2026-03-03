import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../routes/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useNotifications = (user) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasSeenNoti, setHasSeenNoti] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const prevUnreadCount = useRef(0);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('notifications')
        .select('*, actor:actor_id(id, full_name, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) setNotifications(data);

      const { count: fetchedUnreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      const finalCount = fetchedUnreadCount || 0;
      setUnreadCount(finalCount);

      const lastSeen = parseInt(
        localStorage.getItem('hyperx_last_seen_count') || '0',
        10
      );
      if (finalCount <= lastSeen) {
        setHasSeenNoti(true);
      } else {
        setHasSeenNoti(false);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user]);

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      setHasSeenNoti(false);
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const handleReadNotification = async (noti) => {
    if (!noti.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === noti.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', noti.id);
    }
    setNotiOpen(false);

    if (noti.type === 'follow') navigate(`/profile/${noti.actor_id}`);
    else if (
      ['like_post', 'like_comment', 'comment', 'mention'].includes(noti.type)
    )
      navigate(`/post/${noti.resource_id}?commentId=${noti.comment_id || ''}`);
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
  };

  const clearAllNotifications = async (callback) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting notifications:', error);
      alert('Failed to delete notifications.');
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setNotiOpen(false);
      if (callback) callback();
    }
  };

  return {
    notifications,
    unreadCount,
    hasSeenNoti,
    notiOpen,
    setNotiOpen,
    setHasSeenNoti,
    handleReadNotification,
    handleMarkAllRead,
    clearAllNotifications,
  };
};
