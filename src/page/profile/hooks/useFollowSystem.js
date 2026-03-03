import { useState, useRef } from "react";
import { supabase } from "../../../routes/supabaseClient";

export const useFollowSystem = (propUser, profile, refreshFollowing) => {
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const followActionInProgress = useRef(false);

  const handleFollowToggle = async (isFollowing, setIsFollowing, fetchData) => {
    if (!propUser || !profile) return;
    if (propUser.id === profile.id) return;
    if (followActionInProgress.current) return;

    if (isFollowing) {
      // If currently following, ask for confirmation to unfollow
      setIsFollowModalOpen(true);
      return;
    }

    // If not following, immediately follow (Optimistic)
    followActionInProgress.current = true;
    setIsUpdatingFollow(true);

    try {
      setIsFollowing(true);
      
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: propUser.id, following_id: profile.id });

      if (error) {
        setIsFollowing(false);
        throw error;
      }

      await fetchData(true);
      await refreshFollowing();
    } catch (error) {
      console.error("Error following user:", error);
      alert("Follow action failed.");
    } finally {
      setIsUpdatingFollow(false);
      setTimeout(() => {
        followActionInProgress.current = false;
      }, 300);
    }
  };

  const handleConfirmFollow = async (setIsFollowing, fetchData) => {
    if (followActionInProgress.current) return;

    followActionInProgress.current = true;
    setIsUpdatingFollow(true);

    try {
      // Unfollow (Optimistic)
      setIsFollowing(false);
      setIsFollowModalOpen(false);
      
      const { error } = await supabase
        .from("follows")
        .delete()
        .match({ follower_id: propUser.id, following_id: profile.id });

      if (error) {
        setIsFollowing(true);
        throw error;
      }

      await fetchData(true);
      await refreshFollowing();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      alert("Unfollow action failed.");
    } finally {
      setIsUpdatingFollow(false);
      setTimeout(() => {
        followActionInProgress.current = false;
      }, 300);
    }
  };

  return {
    isFollowModalOpen,
    setIsFollowModalOpen,
    isUpdatingFollow,
    handleFollowToggle,
    handleConfirmFollow,
  };
};
