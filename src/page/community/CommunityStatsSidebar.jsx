import React from "react";
import { Users, Sparkles } from "lucide-react";
import UserAvatar from "../../components/UserAvatar";

export const CommunityStatsSidebar = ({ totalMembers, following, loadingFollowing }) => {
  return (
    <div className="hidden xl:flex flex-col w-80 p-6 gap-6 border-l border-white/5 bg-black/20">
      <div className="p-5 tech-card">
        <h2 className="text-white font-black text-xs mb-6 flex items-center gap-2 uppercase tracking-[0.2em] opacity-70">
          <Users size={16} className="text-cyan-400" /> Community Stats
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-white/[0.03] rounded-xl text-center border border-white/5 hover:border-cyan-500/20 transition-all group">
            <div className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
              {totalMembers > 999
                ? (totalMembers / 1000).toFixed(1) + "k"
                : totalMembers}
            </div>
            <div className="text-xs text-gray-500 uppercase font-bold">
              Members
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 tech-card flex-1 flex flex-col overflow-hidden min-h-0">
        <h2 className="text-white font-black text-xs mb-6 flex items-center justify-between uppercase tracking-[0.2em] opacity-70">
          <span className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" /> Message
          </span>
          <span className="text-[10px] text-cyan-400 font-black bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
            {following?.length || 0}
          </span>
        </h2>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {loadingFollowing ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-pulse"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5"></div>
                <div className="h-3 w-20 bg-white/5 rounded-md"></div>
              </div>
            ))
          ) : following?.length === 0 ? (
            <div className="text-center py-6 px-2">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Follow creators to chat with them instantly.
              </p>
            </div>
          ) : (
            following?.map((user) => (
              <button
                key={user.id}
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("hyperx-open-chat", { detail: user }),
                  )
                }
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group text-left"
              >
                <UserAvatar
                  user={{ raw_user_meta_data: user }}
                  size="xs"
                  className="w-9 h-9 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-300 group-hover:text-white truncate transition-colors uppercase tracking-tighter">
                    {user.full_name || "Unknown"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
