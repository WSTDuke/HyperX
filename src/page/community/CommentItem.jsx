import React, { useState, useEffect, memo } from "react";
import { Heart, MoreHorizontal, Trash2, CornerDownRight } from "lucide-react";
import UserAvatar from "../../components/UserAvatar";
import formatTime from "./formatTime";
import { renderContentWithHashtags } from "../../utils/formatters";
import { supabase } from "../../routes/supabaseClient";

export const CommentItem = memo(
  ({
    comment,
    allComments,
    currentUser,
    onDelete,
    onReplySuccess,
    depth = 0,
    highlightId,
    onTagClick,
  }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const commentRef = React.useRef(null);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const indentLevel = depth > 2 ? 2 : depth;
    const paddingLeftValue = indentLevel * 24;
    const childComments = allComments.filter((c) => c.parent_id === comment.id);

    const profile = Array.isArray(comment.profiles)
      ? comment.profiles[0]
      : comment.profiles || {};
    const metadata = comment.raw_user_meta_data || {};
    const authorName =
      comment.full_name ||
      profile?.full_name ||
      profile?.name ||
      metadata.full_name ||
      metadata.name ||
      "Anonymous";
    const avatarUrl =
      comment.avatar_url ||
      profile?.avatar_url ||
      profile?.picture ||
      profile?.avatar ||
      metadata.avatar_url ||
      metadata.picture ||
      metadata.avatar;

    useEffect(() => {
      if (highlightId && String(comment.id) === String(highlightId)) {
        setTimeout(() => {
          commentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 500);
        setIsHighlighted(true);
        const timer = setTimeout(() => setIsHighlighted(false), 2500);
        return () => clearTimeout(timer);
      }
    }, [highlightId, comment.id]);

    useEffect(() => {
      if (!currentUser) return;
      const checkLike = async () => {
        const { data } = await supabase
          .from("comment_likes")
          .select("id")
          .eq("comment_id", comment.id)
          .eq("user_id", currentUser.id)
          .maybeSingle();
        if (data) setIsLiked(true);
        const { count } = await supabase
          .from("comment_likes")
          .select("id", { count: "exact", head: true })
          .eq("comment_id", comment.id);
        setLikes(count || 0);
      };
      checkLike();
    }, [comment.id, currentUser]);

    const handleLikeComment = async () => {
      if (!currentUser) return alert("Please log in.");
      if (isLiked) {
        setLikes((p) => Math.max(0, p - 1));
        setIsLiked(false);
        await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", comment.id)
          .eq("user_id", currentUser.id);
      } else {
        setLikes((p) => p + 1);
        setIsLiked(true);
        await supabase
          .from("comment_likes")
          .insert({ comment_id: comment.id, user_id: currentUser.id });

        if (currentUser.id !== comment.user_id) {
          await supabase.from("notifications").insert({
            user_id: comment.user_id,
            actor_id: currentUser.id,
            type: "like_comment",
            content:
              comment.content.substring(0, 30) +
              (comment.content.length > 30 ? "..." : ""),
            resource_id: comment.post_id,
            comment_id: comment.id,
            is_read: false,
          });
        }
      }
    };

    const handleToggleReply = () => {
      if (!currentUser) return alert("Please log in.");
      if (!showReplyInput) {
        setReplyContent(`@${authorName} `);
      }
      setShowReplyInput(!showReplyInput);
    };

    const handleSendReply = async () => {
      if (!replyContent.trim()) return;
      setIsSendingReply(true);
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: comment.post_id,
          user_id: currentUser.id,
          content: replyContent,
          parent_id: comment.id,
        })
        .select("*, profiles(*)")
        .single();
      if (!error && data) {
        const newReply = {
          ...data,
          email: currentUser.email,
          raw_user_meta_data:
            currentUser.user_metadata || currentUser.raw_user_meta_data,
          profiles: data.profiles || {
            full_name: currentUser.user_metadata?.full_name,
            avatar_url:
              currentUser.user_metadata?.avatar_url ||
              currentUser.user_metadata?.picture,
          },
        };
        onReplySuccess(newReply);
        setReplyContent("");
        setShowReplyInput(false);

        if (currentUser.id !== comment.user_id) {
          await supabase.from("notifications").insert({
            user_id: comment.user_id,
            actor_id: currentUser.id,
            type: "comment",
            content:
              replyContent.substring(0, 50) +
              (replyContent.length > 50 ? "..." : ""),
            resource_id: comment.post_id,
            comment_id: data.id,
            is_read: false,
          });
        }
      } else {
        alert("Error replying: " + error?.message);
      }
      setIsSendingReply(false);
    };

    return (
      <div className="flex flex-col relative" ref={commentRef}>
        <div
          className={`flex gap-3 group relative p-3 rounded-xl transition-all duration-500 ease-in-out border border-transparent ${isHighlighted ? "bg-cyan-500/10 border-cyan-500/30" : "hover:bg-white/[0.03]"}`}
          style={{ marginLeft: `${paddingLeftValue}px` }}
        >
          {depth > 0 && (
            <div className="absolute -left-[14px] top-4 w-3 h-px bg-white/10"></div>
          )}
          <div className="flex-shrink-0 pt-1 relative z-10">
            <UserAvatar
              user={{
                ...comment,
                id: comment.user_id,
                profiles: profile,
                raw_user_meta_data: metadata,
                avatar_url: avatarUrl,
                full_name: authorName,
              }}
              size="sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-bold text-cyan-200">
                {authorName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 font-mono">
                  {formatTime(comment.created_at)}
                </span>
                {currentUser && currentUser.id === comment.user_id && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="text-gray-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {showMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowMenu(false)}
                        ></div>
                        <div className="absolute right-0 top-5 z-20 w-24 bg-[#1A1D26] border border-white/10 rounded-lg shadow-xl py-1">
                          <button
                            onClick={() => onDelete(comment.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-white/5 text-left"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed break-words font-light">
              {renderContentWithHashtags(comment.content, onTagClick)}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleLikeComment}
                className={`text-xs font-medium flex items-center gap-1 transition-colors ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}
              >
                <Heart size={12} fill={isLiked ? "currentColor" : "none"} />{" "}
                {likes > 0 && likes}
              </button>
              <button
                onClick={handleToggleReply}
                className="text-xs font-medium text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                Reply
              </button>
            </div>
            {showReplyInput && currentUser && (
              <div className="mt-3 flex gap-3 items-center animate-in fade-in slide-in-from-top-1">
                <UserAvatar
                  user={{
                    ...currentUser,
                    id: currentUser.id,
                    avatar_url:
                      currentUser.user_metadata?.avatar_url ||
                      currentUser.user_metadata?.picture,
                  }}
                  size="sm"
                  disableLink={true}
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    autoFocus
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    disabled={isSendingReply}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyContent.trim() || isSendingReply}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600 hover:text-black disabled:opacity-30 transition-all"
                  >
                    <CornerDownRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {childComments.map((child) => (
          <CommentItem
            key={child.id}
            comment={child}
            allComments={allComments}
            currentUser={currentUser}
            onDelete={onDelete}
            onReplySuccess={onReplySuccess}
            depth={depth + 1}
            highlightId={highlightId}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    );
  }
);
