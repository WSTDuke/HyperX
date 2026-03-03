import { useState, useEffect } from 'react';
import { supabase } from '../routes/supabaseClient';

export const useChatConversations = (user) => {
  const [conversations, setConversations] = useState([]);
  const [msgOpen, setMsgOpen] = useState(false);

  useEffect(() => {
    if (!msgOpen || !user?.id) return;

    const fetchConversations = async () => {
      try {
        const { data: convs, error } = await supabase
          .from("conversations")
          .select("*")
          .or(`user_1.eq.${user.id},user_2.eq.${user.id}`)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          console.error("Error fetching conversations table:", error);
          return;
        }

        if (!convs || convs.length === 0) {
          setConversations([]);
          return;
        }

        const enriched = await Promise.all(
          convs.map(async (c) => {
            const partnerId = c.user_1 === user.id ? c.user_2 : c.user_1;

            const { data: partner } = await supabase
              .from("profiles")
              .select("id, full_name, avatar_url, email")
              .eq("id", partnerId)
              .single();

            const { data: lastMsg } = await supabase
              .from("messages")
              .select("content, created_at, sender_id, is_read")
              .eq("conversation_id", c.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            const clearedAt =
              user.id === c.user_1 ? c.user_1_cleared_at : c.user_2_cleared_at;
            let visibleMsg = lastMsg;

            if (clearedAt && lastMsg) {
              const clearTime = new Date(clearedAt).getTime();
              const msgTime = new Date(lastMsg.created_at).getTime();

              if (msgTime <= clearTime) {
                visibleMsg = null;
              }
            }

            return {
              ...c,
              partner,
              lastMessage: visibleMsg,
            };
          })
        );

        const activeConvs = enriched.filter((c) => c.lastMessage);

        const sorted = activeConvs.sort((a, b) => {
          const timeA = new Date(a.lastMessage.created_at);
          const timeB = new Date(b.lastMessage.created_at);
          return timeB - timeA;
        });

        setConversations(sorted);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
  }, [msgOpen, user]);

  const handleOpenChat = async (partner, conversationId) => {
    if (!partner) return;

    if (conversationId && user?.id) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
        .eq("is_read", false);
    }

    setMsgOpen(false);

    window.dispatchEvent(
      new CustomEvent("hyperx-open-chat", { detail: partner })
    );
  };

  const deleteConversation = async (convId) => {
    if (!user?.id || !convId) return;

    try {
      const conv = conversations.find(c => c.id === convId);
      if (!conv) return false;

      const now = new Date().toISOString();
      const field = user.id === conv.user_1 ? "user_1_cleared_at" : "user_2_cleared_at";

      const { error } = await supabase
        .from("conversations")
        .update({ [field]: now })
        .eq("id", convId);

      if (error) throw error;

      setConversations((prev) => prev.filter((c) => c.id !== convId));

      window.dispatchEvent(
        new CustomEvent("hyperx-chat-deleted", {
          detail: { conversationId: convId },
        })
      );
      
      return true;
    } catch (err) {
      console.error("Error deleting conversation:", err);
      return false;
    }
  };

  return {
    conversations,
    setConversations,
    msgOpen,
    setMsgOpen,
    handleOpenChat,
    deleteConversation
  };
};
