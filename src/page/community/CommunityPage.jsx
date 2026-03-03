import { useState, useRef } from "react";
import {
  Search,
  Plus,
  MessagesSquare,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import PostFormModal from "./PostFormModal";
import PostItem from "./PostItem";
import { useFollowing } from "../../context/FollowingContext";
import { useCommunityPosts } from "../../hooks/useCommunityPosts";
import { TrendingSidebar } from "./TrendingSidebar";
import { CommunityStatsSidebar } from "./CommunityStatsSidebar";

export default function Community({ user }) {
  const { following, isFollowingInitialLoading: loadingFollowing } = useFollowing();

  const {
    posts,
    loading,
    currentUser,
    searchQuery,
    handleSearchChange,
    totalMembers,
    trendingTags,
    submitPost,
    handlePostDeleted,
  } = useCommunityPosts(user, following);

  const [form, setForm] = useState({ title: "", content: "" });
  const [showModal, setShowModal] = useState(false);
  const scrollContainerRef = useRef(null);

  const handlePostSubmit = async () => {
    const { error, success } = await submitPost(form);
    if (error) {
      alert(error);
    } else if (success) {
      setShowModal(false);
      setForm({ title: "", content: "" });
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const PostSkeleton = () => (
    <div className="bg-[#0B0D14] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl skeleton-cyan"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 skeleton-cyan"></div>
            <div className="h-3 w-20 skeleton-cyan opacity-50"></div>
          </div>
        </div>
        <div className="h-8 w-8 rounded-xl skeleton-cyan opacity-30"></div>
      </div>
  
      <div className="space-y-3 mb-6 ml-16">
        <div className="h-6 w-3/4 skeleton-cyan"></div>
        <div className="h-4 w-full skeleton-cyan opacity-40"></div>
        <div className="h-4 w-5/6 skeleton-cyan opacity-40"></div>
      </div>
  
      <div className="flex items-center gap-4 ml-16 pt-6 border-t border-white/5">
        <div className="h-10 w-24 rounded-2xl skeleton-cyan opacity-30"></div>
        <div className="h-10 w-24 rounded-2xl skeleton-cyan opacity-30"></div>
        <div className="h-10 w-12 rounded-2xl skeleton-cyan opacity-30"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#05050A] h-screen w-screen overflow-hidden text-gray-300 font-sans pt-20 relative isolate flex flex-col">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="fixed top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full h-full overflow-hidden relative z-10">
        
        <TrendingSidebar
          loading={loading}
          trendingTags={trendingTags}
          handleSearchChange={handleSearchChange}
        />

        <div className="flex-1 flex flex-col h-full relative">
          <div className="flex-shrink-0 p-4 md:p-6 z-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0B0D14]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl ring-1 ring-white/5">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div>
                  <h1 className="flex items-center gap-2 text-xl font-black text-white tracking-tighter uppercase glow-text-cyan">
                    <MessagesSquare size={16} className="h-6 w-6 text-white" />
                    <span>Forum</span>
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group flex-1 md:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search
                      size={16}
                      className="text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Feed..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-black/40 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono text-xs tracking-widest transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {currentUser ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-3 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 whitespace-nowrap uppercase tracking-tighter text-sm"
                  >
                    <Plus size={18} strokeWidth={3} />
                    <span className="hidden sm:inline">Add Post</span>
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-cyan-400 border border-cyan-500/30 rounded-xl font-medium transition text-sm whitespace-nowrap"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth px-4 md:px-6 pb-20"
          >
            {loading && posts.length === 0 ? (
              <div className="space-y-6 pt-2">
                {[...Array(3)].map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] text-center">
                <div className="p-4 bg-white/5 rounded-full mb-4 text-gray-600">
                  <Search size={32} />
                </div>
                <h3 className="text-white font-bold text-lg">No posts found</h3>
                <p className="text-gray-500 text-sm">
                  Try searching for something else.
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-w-3xl mx-auto">
                {posts.map((post) =>
                  post ? (
                    <PostItem
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onPostDeleted={handlePostDeleted}
                      onTagClick={handleSearchChange}
                    />
                  ) : null,
                )}
              </div>
            )}
          </div>
        </div>

        <CommunityStatsSidebar
          totalMembers={totalMembers}
          following={following}
          loadingFollowing={loadingFollowing}
        />
      </div>

      <PostFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={handlePostSubmit}
        loading={loading}
        currentUser={currentUser}
      />
    </div>
  );
}
