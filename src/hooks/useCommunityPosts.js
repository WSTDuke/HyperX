import { useState, useCallback, useEffect } from "react";
import { supabase } from "../routes/supabaseClient";
import { useSearchParams } from "react-router-dom";

export const useCommunityPosts = (user, following) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [totalMembers, setTotalMembers] = useState(0);
  const [trendingTags, setTrendingTags] = useState([]);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setTimeout(() => setSearchQuery(query), 0);
    }
  }, [searchParams]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val) {
      setSearchParams({ search: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  useEffect(() => {
    const loadUserStats = async () => {
      setCurrentUser(user);
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      setTotalMembers(count || 0);
    };
    loadUserStats();
  }, [user]);

  const loadPosts = useCallback(async () => {
    let query = supabase
      .from("posts_view")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });

    if (user && following) {
      const allowedIds = [user.id, ...following.map((f) => f.id)];
      query = query.in("user_id", allowedIds);
    }

    let { data, error } = await query;

    if (error) {
      console.warn("posts_view error, using fallback join:", error);
      let fbQuery = supabase
        .from("community_posts")
        .select("*, profiles!inner(*)")
        .order("created_at", { ascending: false });

      if (user && following) {
        const allowedIds = [user.id, ...following.map((f) => f.id)];
        fbQuery = fbQuery.in("user_id", allowedIds);
      }

      const res = await fbQuery;
      data = res.data;
      error = res.error;
    }

    if (!error && data) {
      const formattedPosts = data.map((post) => {
        const userInfo = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles || {};
        const metadata = post.raw_user_meta_data || {};

        const fullName =
          post.full_name ||
          userInfo.full_name ||
          userInfo.name ||
          metadata.full_name ||
          metadata.name ||
          "Anonymous";
        const avatarUrl =
          post.avatar_url ||
          userInfo.avatar_url ||
          userInfo.picture ||
          userInfo.avatar ||
          metadata.avatar_url ||
          metadata.picture ||
          metadata.avatar;
        const email = post.email || userInfo.email;

        return {
          ...post,
          profiles: userInfo,
          raw_user_meta_data: {
            ...metadata,
            ...userInfo,
            full_name: fullName,
            avatar_url: avatarUrl,
          },
          email: email,
          avatar_url: avatarUrl,
        };
      });
      setPosts(formattedPosts);

      const tagMap = new Map();
      const tagRegex = /#[\w\u00C0-\u024F]+/gu;

      formattedPosts.forEach((post) => {
        const text = `${post.title} ${post.content}`;
        const tags = text.match(tagRegex);
        if (tags) {
          const uniqueTagsInPost = new Set(tags.map((t) => t.toLowerCase()));
          uniqueTagsInPost.forEach((tag) => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
          });
        }
      });

      const sortedTags = [...tagMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map((entry) => entry[0]);

      setTrendingTags(sortedTags);
    } else {
      console.error("Error loading posts:", error);
      setPosts([]);
    }
  }, [user, following]);

  useEffect(() => {
    const handleRefresh = async () => {
      setLoading(true);
      setPosts([]);
      setTrendingTags([]);
      await loadPosts();
      setLoading(false);
    };

    window.addEventListener("hyperx-refresh-community", handleRefresh);
    return () => window.removeEventListener("hyperx-refresh-community", handleRefresh);
  }, [loadPosts]);

  useEffect(() => {
    const handleAvatarUpdated = () => loadPosts();
    window.addEventListener("hyperx-avatar-updated", handleAvatarUpdated);
    return () => window.removeEventListener("hyperx-avatar-updated", handleAvatarUpdated);
  }, [loadPosts]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      await loadPosts();
      setLoading(false);
    };
    fetchPosts();
  }, [loadPosts]);

  const submitPost = async (form) => {
    if (!currentUser || !currentUser.id) return { error: "Lỗi: Không tìm thấy thông tin người dùng!" };
    
    setLoading(true);
    const { error } = await supabase.from("community_posts").insert({
      title: form.title,
      content: form.content,
      user_id: currentUser.id,
    });

    if (error) {
      setLoading(false);
      return { error: error.message };
    } else {
      await loadPosts();
      setLoading(false);
      return { success: true };
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
  };

  const filteredPosts = posts.filter(
    (post) =>
      (post?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post?.content || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    posts: filteredPosts,
    loading,
    currentUser,
    searchQuery,
    handleSearchChange,
    totalMembers,
    trendingTags,
    submitPost,
    handlePostDeleted,
  };
};
