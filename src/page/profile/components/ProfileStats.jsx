import React from "react";
import { Package, Grid, UserPlus, UserCheck } from "lucide-react";

const StatTab = ({ label, value, icon, color, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all relative overflow-hidden group
        ${
          active
            ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            : "bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5"
        }`}
  >
    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${active ? "bg-white/10" : "bg-white/5"} ${color} transition-colors group-hover:scale-110 duration-300`}>
      {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
    </div>
    
    <div className="flex flex-col items-start min-w-[60px]">
      <span className={`text-xl font-black ${active ? "text-white" : "text-gray-400"} tracking-tight uppercase`}>
        {value}
      </span>
      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${active ? "text-gray-300" : "text-gray-600"} transition-colors`}>
        {label}
      </span>
    </div>

    {active && (
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    )}
  </button>
);

const ProfileStats = ({ stats, activeTab, handleTabChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 py-8 border-b border-white/5">
      <StatTab
        label="Projects"
        value={stats.productCount}
        icon={<Package />}
        color="text-green-400"
        onClick={() => handleTabChange("products")}
        active={activeTab === "products" || activeTab === "all"}
      />
      <StatTab
        label="Posts"
        value={stats.postCount}
        icon={<Grid />}
        color="text-blue-400"
        onClick={() => handleTabChange("posts")}
        active={activeTab === "posts"}
      />
      <StatTab
        label="Followers"
        value={stats.followerCount}
        icon={<UserPlus />}
        color="text-pink-400"
        onClick={() => handleTabChange("followers")}
        active={activeTab === "followers"}
      />
      <StatTab
        label="Following"
        value={stats.followingCount}
        icon={<UserCheck />}
        color="text-cyan-400"
        onClick={() => handleTabChange("following")}
        active={activeTab === "following"}
      />
    </div>
  );
};

export default ProfileStats;
