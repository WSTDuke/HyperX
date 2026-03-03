import React from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../../../components/UserAvatar";
import { Calendar, Mail, Edit3, UserPlus, UserCheck, Loader2, MessageCircle } from "lucide-react";

const ProfileHeader = ({
  profile,
  propUser,
  isFollowing,
  isUpdatingFollow,
  handleFollowToggle,
}) => {
  const navigate = useNavigate();
  const isOwnProfile = propUser && profile && propUser.id === profile.id;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-6 duration-700">
      <div className="relative group mx-auto lg:mx-0">
        <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full p-1 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#05050A] bg-[#0B0D14] flex items-center justify-center">
            <UserAvatar
              user={{
                ...profile,
                raw_user_meta_data: {
                  ...profile,
                  avatar_url: profile.avatar_url,
                  full_name: profile.full_name,
                },
              }}
              size="xl"
              disableLink
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>
        {isOwnProfile && (
          <button
            onClick={() => navigate("/setting")}
            className="absolute bottom-4 right-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-cyan-500 hover:text-black transition-all shadow-xl group/btn"
          >
            <Edit3 size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="space-y-4 text-center lg:text-left">
        <h1 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter glow-text-cyan">
          {profile.full_name || "Unknown User"}
        </h1>
      </div>

      <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
        {!isOwnProfile && (
          <>
            <button
              onClick={handleFollowToggle}
              disabled={isUpdatingFollow}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden group shadow-lg
                ${
                  isFollowing
                    ? "bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:brightness-110"
                }`}
            >
              {isUpdatingFollow ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserCheck size={16} className="group-hover:hidden" />
                  <span className="group-hover:hidden">Following</span>
                  <span className="hidden group-hover:inline">Unfollow</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Follow</span>
                </>
              )}
            </button>
            
            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("hyperx-open-chat", {
                    detail: profile,
                  }),
                )
              }
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-gray-300 text-xs uppercase tracking-[0.2em] transition-all hover:border-cyan-500/30 active:scale-95 shadow-lg"
            >
              <MessageCircle size={16} className="text-cyan-500" />
              Message
            </button>
          </>
        )}
      </div>

      {/* Extra Metadata */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-500 group">
            <div className="p-2 bg-white/5 rounded-lg group-hover:text-cyan-400 transition-colors">
              <Mail size={14} />
            </div>
            <span className="truncate">{profile.email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-mono text-gray-500 group">
            <div className="p-2 bg-white/5 rounded-lg group-hover:text-blue-400 transition-colors">
              <Calendar size={14} />
            </div>
            <span>
              Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              }) : "Recent"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
