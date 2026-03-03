import { useState, useCallback, useEffect } from "react";
import { supabase } from "../routes/supabaseClient";

export const usePost = ({ initialPost, currentUser }) => {
  const [postData, setPostData] = useState(initialPost || {});
  const [likes, setLikes] = useState(initialPost?.like_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(initialPost?.comment_count || 0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);

  const fetchCommentsData = useCallback(async () => {
    if (!postData?.id) return;
    setLoadingComments(true);
    const { data, error } = await supabase
      .from("comments_view")
      .select("*, profiles(*)")
      .eq("post_id", postData.id)
      .order("created_at", { ascending: true });
    
    if (!error && data) {
      const formattedComments = data.map((cmt) => {
        const profile = Array.isArray(cmt.profiles)
          ? cmt.profiles[0]
          : cmt.profiles || {};
        const metadata = cmt.raw_user_meta_data || {};
        const authorName =
          cmt.full_name ||
          profile?.full_name ||
          profile?.name ||
          metadata.full_name ||
          metadata.name ||
          "Anonymous";
        const avatarUrl =
          cmt.avatar_url ||
          profile?.avatar_url ||
          profile?.picture ||
          profile?.avatar ||
          metadata.avatar_url ||
          metadata.picture ||
          metadata.avatar;

        return {
          ...cmt,
          profiles: profile,
          raw_user_meta_data: {
            ...metadata,
            ...profile,
            full_name: authorName,
            avatar_url: avatarUrl,
          },
          avatar_url: avatarUrl,
          full_name: authorName,
        };
      });
      setComments(formattedComments);
    }
    setLoadingComments(false);
  }, [postData?.id]);

  useEffect(() => {
    const ensureProfileData = async () => {
      if (!postData?.id || !postData?.user_id) return;
      const hasProfile =
        postData.profiles &&
        (Array.isArray(postData.profiles)
          ? postData.profiles.length > 0
          : !!postData.profiles.id);
      if (!hasProfile) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", postData.user_id)
          .single();
        if (data && !error)
          setPostData((prev) => ({ ...prev, profiles: data }));
      }
    };
    ensureProfileData();
  }, [postData?.user_id, postData?.profiles, postData?.id]);

  useEffect(() => {
    if (!currentUser || !postData?.id) return;
    const checkLikeStatus = async () => {
      const { data } = await supabase
        .from("post_likes")
        .select("user_id")
        .eq("post_id", postData.id)
        .eq("user_id", currentUser.id)
        .maybeSingle();
      if (data) setIsLiked(true);
    };
    checkLikeStatus();
  }, [currentUser, postData?.id]);

  const handleLike = useCallback(async () => {
    if (!currentUser || !postData?.id) return { error: "Please log in." };
    if (isLiked) {
      setLikes((p) => Math.max(0, p - 1));
      setIsLiked(false);
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postData.id)
        .eq("user_id", currentUser.id);
    } else {
      setLikes((p) => p + 1);
      setIsLiked(true);
      await supabase
        .from("post_likes")
        .insert({ post_id: postData.id, user_id: currentUser.id });

      if (currentUser.id !== postData.user_id) {
        await supabase.from("notifications").insert({
          user_id: postData.user_id,
          actor_id: currentUser.id,
          type: "like_post",
          resource_id: postData.id,
          is_read: false,
        });
      }
    }
  }, [isLiked, currentUser, postData?.id, postData?.user_id]);

  const handleSendComment = useCallback(async (newComment) => {
    if (!currentUser || !postData?.id) return { error: "Please log in." };
    if (!newComment.trim()) return { error: "Empty comment" };
    setIsSendingComment(true);
    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: postData.id,
        user_id: currentUser.id,
        content: newComment,
        parent_id: null,
      })
      .select("*, profiles(*)")
      .single();
      
    if (!error && data) {
      const userMeta =
        currentUser.user_metadata || currentUser.raw_user_meta_data || {};
      const optimistic = {
        ...data,
        email: currentUser.email,
        raw_user_meta_data: userMeta,
        profiles: data.profiles || {
          full_name: userMeta.full_name,
          avatar_url: userMeta.avatar_url || userMeta.picture,
        },
        avatar_url: userMeta.avatar_url || userMeta.picture,
        full_name: userMeta.full_name,
      };
      setComments((prev) => [...prev, optimistic]);
      setCommentCount((p) => p + 1);

      if (currentUser.id !== postData.user_id) {
        await supabase.from("notifications").insert({
          user_id: postData.user_id,
          actor_id: currentUser.id,
          type: "comment",
          content: newComment.substring(0, 50) + (newComment.length > 50 ? "..." : ""),
          resource_id: postData.id,
          comment_id: data.id,
          is_read: false,
        });
      }
    }
    setIsSendingComment(false);
    return { error: error?.message, success: !error };
  }, [currentUser, postData?.id, postData?.user_id]);

  const executeDeleteComment = useCallback(async (commentToDelete) => {
    if (!commentToDelete) return false;
    setIsDeletingComment(true);
    const { error } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", commentToDelete);
      
    if (!error) {
      setComments((prev) =>
        prev.filter((c) => c.id !== commentToDelete && c.parent_id !== commentToDelete)
      );
      setCommentCount((p) => Math.max(0, p - 1));
    }
    setIsDeletingComment(false);
    return !error;
  }, []);

  const executeDeletePost = async () => {
    setIsDeletingPost(true);
    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", postData.id);
    setIsDeletingPost(false);
    return { success: !error, error: error?.message };
  };

  const executeEditPost = async (title, content) => {
    if (!title.trim() || !content.trim()) return { error: "Empty fields" };
    setIsUpdatingPost(true);
    const { data, error } = await supabase
      .from("community_posts")
      .update({ title, content })
      .eq("id", postData.id)
      .select("*, profiles(*)");
      
    setIsUpdatingPost(false);
    if (!error && data && data.length > 0) {
      const updatedPostData = data[0];
      setPostData((prev) => ({
        ...prev,
        title: updatedPostData.title,
        content: updatedPostData.content,
        updated_at: updatedPostData.updated_at || prev.updated_at,
        profiles: updatedPostData.profiles || prev.profiles,
      }));
      return { success: true, updatedPostData };
    }
    return { error: error?.message || "Error updating post", success: false };
  };

  const handleReplySuccess = useCallback((newReply) => {
    setComments((prev) => [...prev, newReply]);
    setCommentCount((p) => p + 1);
  }, []);

  return {
    postData,
    likes,
    isLiked,
    comments,
    commentCount,
    loadingComments,
    isSendingComment,
    isDeletingComment,
    isDeletingPost,
    isUpdatingPost,
    fetchCommentsData,
    handleLike,
    handleSendComment,
    executeDeleteComment,
    executeDeletePost,
    executeEditPost,
    handleReplySuccess,
  };
};
