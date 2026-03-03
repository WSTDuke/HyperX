import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "../../../routes/supabaseClient";

export const useProfileData = (effectiveId, propUser) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const [stats, setStats] = useState({
    postCount: 0,
    likeCount: 0,
    productCount: 0,
    followerCount: 0,
    followingCount: 0,
  });

  const lastIdRef = useRef(null);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);

      if (!effectiveId) {
        setIsLoading(false);
        return;
      }

      try {
        const [
          { data: profileData, error: profileError },
          { data: postsData },
          { data: followersData, count: followerCount },
          { data: followingData, count: followingCount },
          { data: productsData },
          followStatusResult,
        ] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", effectiveId).single(),
          supabase
            .from("community_posts")
            .select("*, profiles(*)")
            .eq("user_id", effectiveId)
            .order("created_at", { ascending: false }),
          supabase
            .from("follows")
            .select("follower_id", { count: "exact" })
            .eq("following_id", effectiveId),
          supabase
            .from("follows")
            .select("following_id", { count: "exact" })
            .eq("follower_id", effectiveId),
          supabase
            .from("products")
            .select("*")
            .eq("user_id", effectiveId)
            .order("created_at", { ascending: false }),

          propUser && propUser.id !== effectiveId
            ? supabase
                .from("follows")
                .select("follower_id")
                .eq("follower_id", propUser.id)
                .eq("following_id", effectiveId)
                .maybeSingle()
            : Promise.resolve({ data: null }),
        ]);

        if (profileError) throw profileError;

        const fetchProfileDetails = async (idList, idField) => {
          if (!idList || idList.length === 0) return [];
          const ids = idList.map((item) => item[idField]).filter(Boolean);
          if (ids.length === 0) return [];
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .in("id", ids);
          return ids.map(
            (id) =>
              data?.find((p) => p.id === id) || {
                id,
                full_name: "Private User",
              },
          );
        };

        const [followerProfiles, followingProfiles] = await Promise.all([
          fetchProfileDetails(followersData, "follower_id"),
          fetchProfileDetails(followingData, "following_id"),
        ]);

        const formattedPosts = (postsData || []).map((post) => {
          const profileInfo = post.profiles || {};
          const metadata = post.raw_user_meta_data || {};
          return {
            ...post,
            raw_user_meta_data: {
              ...metadata,
              full_name:
                post.full_name ||
                profileInfo.full_name ||
                metadata.full_name ||
                profileInfo.name ||
                metadata.name,
              avatar_url:
                post.avatar_url ||
                profileInfo.avatar_url ||
                profileInfo.picture ||
                metadata.avatar_url ||
                metadata.picture,
            },
            email: post.email || profileInfo.email,
          };
        });

        setProfile(profileData);
        setProducts(productsData || []);
        setPosts(formattedPosts);
        setFollowers(followerProfiles);
        setFollowing(followingProfiles);
        setIsFollowing(!!followStatusResult.data);
        setStats({
          postCount: postsData?.length || 0,
          likeCount: formattedPosts.reduce(
            (acc, curr) => acc + (curr.like_count || 0),
            0,
          ),
          productCount: productsData?.length || 0,
          followerCount: followerCount || 0,
          followingCount: followingCount || 0,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [effectiveId, propUser],
  );

  useEffect(() => {
    if (!effectiveId) return;

    if (lastIdRef.current && lastIdRef.current !== effectiveId) {
      setProfile(null);
      setPosts([]);
      setProducts([]);
    }

    lastIdRef.current = effectiveId;
    fetchData();
  }, [effectiveId, fetchData]);

  // Re-fetch khi user đổi avatar (custom event được bắn từ Setting.jsx sau khi DB đã update xong)
  useEffect(() => {
    const handleAvatarUpdated = () => {
      if (effectiveId) fetchData(true);
    };
    window.addEventListener("hyperx-avatar-updated", handleAvatarUpdated);
    return () => window.removeEventListener("hyperx-avatar-updated", handleAvatarUpdated);
  }, [effectiveId, fetchData]);

  return {
    profile,
    posts,
    products,
    isLoading,
    followers,
    following,
    isFollowing,
    stats,
    setProfile,
    setPosts,
    setProducts,
    setStats,
    setIsFollowing,
    fetchData,
  };
};
