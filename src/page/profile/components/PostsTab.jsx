import React from "react";
import { Grid, Activity } from "lucide-react";
import PostItem from "../../community/PostItem";

const PostSkeleton = () => (
  <div className="bg-[#0B0D14] border border-white/10 rounded-2xl p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full skeleton"></div>
      <div className="space-y-2">
        <div className="h-4 w-24 skeleton rounded"></div>
        <div className="h-3 w-16 skeleton rounded opacity-50"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full skeleton rounded opacity-60"></div>
      <div className="h-4 w-5/6 skeleton rounded opacity-40"></div>
    </div>
    <div className="h-48 w-full skeleton rounded-xl opacity-30"></div>
  </div>
);

const PostsTab = ({ posts, propUser, handlePostDeleted, handlePostUpdated, isLoading }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
          <Grid size={22} />
        </div>
        <h2 className="text-2xl font-bold text-white">Community Activity</h2>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0B0D14] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-colors"
            >
              <PostItem
                post={post}
                currentUser={propUser}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className="grid gap-6">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl text-center">
          <Activity className="h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No activity yet</h3>
          <p className="text-gray-500 text-sm">
            This user hasn't posted anything to the community.
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsTab;
