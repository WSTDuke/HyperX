import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, UserX, UserPlus, UserCheck } from "lucide-react";
import UserAvatar from "../../../components/UserAvatar";

const FollowersTab = ({ activeTab, followers, following, setActiveTab }) => {
  const users = activeTab === "followers" ? followers : following;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-1">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${activeTab === "followers" ? "bg-pink-500/10 text-pink-400" : "bg-cyan-500/10 text-cyan-400"}`}
          >
            {activeTab === "followers" ? <UserPlus size={22} /> : <UserCheck size={22} />}
          </div>
          <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
          <span className="text-sm font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {users.length}
          </span>
        </div>

        <button
          onClick={() => setActiveTab("all")}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors group bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Overview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length > 0 ? (
          users.map((u) => (
            <Link
              key={u.id}
              to={`/profile/${u.id}`}
              className="group flex items-center gap-4 p-4 bg-[#0B0D14] border border-white/5 rounded-2xl hover:border-cyan-500/30 hover:bg-white/[0.02] transition-all"
            >
              <UserAvatar
                user={{
                  ...u,
                  raw_user_meta_data: {
                    avatar_url: u.avatar_url,
                    full_name: u.full_name,
                  },
                }}
                size="md"
                className="w-12 h-12"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate group-hover:text-cyan-400 transition-colors uppercase text-sm tracking-tighter">
                  {u.full_name || "Unknown"}
                </h3>
                <p className="text-gray-500 text-xs truncate">
                  Joined {new Date(u.created_at).toLocaleDateString("en-US")}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-gray-700 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
            <UserX size={40} className="text-gray-600 mb-4" />
            <p className="text-gray-500">No users found in this list.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersTab;
