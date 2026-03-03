import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../routes/supabaseClient";

const FollowingContext = createContext();

export const FollowingProvider = ({ children, user }) => {
  const [following, setFollowing] = useState([]);
  const [isFollowingInitialLoading, setIsFollowingInitialLoading] = useState(true);

  const loadFollowing = useCallback(async () => {
    if (!user) {
      setFollowing([]);
      setIsFollowingInitialLoading(false);
      return;
    }

    try {
      const { data: followIds } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (followIds && followIds.length > 0) {
        const ids = followIds.map((f) => f.following_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", ids);
        setFollowing(profiles || []);
      } else {
        setFollowing([]);
      }
    } catch (error) {
      console.error("Error loading following in context:", error);
    } finally {
      setIsFollowingInitialLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFollowing();
  }, [loadFollowing]);

  return (
    <FollowingContext.Provider
      value={{
        following,
        isFollowingInitialLoading,
        refreshFollowing: loadFollowing,
      }}
    >
      {children}
    </FollowingContext.Provider>
  );
};

export const useFollowing = () => {
  const context = useContext(FollowingContext);
  if (context === undefined) {
    throw new Error("useFollowing must be used within a FollowingProvider");
  }
  return context;
};
