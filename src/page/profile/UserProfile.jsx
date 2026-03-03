import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFollowing } from "../../context/FollowingContext";
import { UserX } from "lucide-react";

// Components
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProductsTab from "./components/ProductsTab";
import PostsTab from "./components/PostsTab";
import FollowersTab from "./components/FollowersTab";
import FollowModal from "./components/FollowModal";

// Hooks
import { useProfileData } from "./hooks/useProfileData";
import { useFollowSystem } from "./hooks/useFollowSystem";

const UserProfile = ({ user: propUser }) => {
  const { refreshFollowing } = useFollowing();
  const { id } = useParams();
  const navigate = useNavigate();

  const effectiveId = id || propUser?.id;
  const [activeTab, setActiveTab] = useState("products");
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Custom hooks
  const {
    profile,
    posts,
    products,
    isLoading,
    followers,
    following,
    isFollowing,
    stats,
    setPosts,
    setStats,
    setIsFollowing,
    fetchData,
  } = useProfileData(effectiveId, propUser);

  const {
    isFollowModalOpen,
    setIsFollowModalOpen,
    isUpdatingFollow,
    handleFollowToggle: handleFollowToggleBase,
    handleConfirmFollow,
  } = useFollowSystem(propUser, profile, refreshFollowing);

  const handlePostUpdated = (updatedPost) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
    );

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedPostId));
    setStats((prev) => ({ ...prev, postCount: prev.postCount - 1 }));
    if (selectedPostId === deletedPostId) setSelectedPostId(null);
  };

  const handleFollowToggle = () => {
    if (!propUser) return alert("Please log in to follow.");
    handleFollowToggleBase(isFollowing, setIsFollowing, fetchData);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!profile && !isLoading) {
    return (
      <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center text-center gap-6 pt-20">
        <div className="p-6 bg-white/5 rounded-full">
          <UserX size={48} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">User Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-cyan-600 text-black font-bold rounded-lg hover:bg-cyan-500 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050A] text-gray-100 font-sans selection:bg-cyan-500/30 relative flex flex-col pt-20">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full relative z-10 flex-1">
        {!profile ? (
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-white/5 rounded-3xl"></div>
            <div className="h-32 bg-white/5 rounded-2xl"></div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 animate-in fade-in duration-500">
            {/* --- Sidebar (Left Column) --- */}
            <div className="lg:sticky lg:top-28 self-start">
              <ProfileHeader
                profile={profile}
                propUser={propUser}
                isFollowing={isFollowing}
                isUpdatingFollow={isUpdatingFollow}
                handleFollowToggle={handleFollowToggle}
              />
            </div>

            {/* --- Content (Right Column) --- */}
            <div className="mt-8 lg:mt-0">
              <ProfileStats
                stats={stats}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
              />

              <div className="mt-6">
                {activeTab === "followers" || activeTab === "following" ? (
                  <FollowersTab
                    activeTab={activeTab}
                    followers={followers}
                    following={following}
                    setActiveTab={setActiveTab}
                  />
                ) : (
                  <div className="space-y-12">
                    {(activeTab === "products") && (
                        <ProductsTab
                          products={products}
                          activeTab={activeTab}
                          isLoading={isLoading}
                        />
                      )}

                    {(activeTab === "posts") && (
                      <PostsTab
                        posts={posts}
                        propUser={propUser}
                        handlePostDeleted={handlePostDeleted}
                        handlePostUpdated={handlePostUpdated}
                        isLoading={isLoading}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <FollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        onConfirm={() => handleConfirmFollow(setIsFollowing, fetchData)}
        profile={profile}
      />
    </div>
  );
};

export default UserProfile;
