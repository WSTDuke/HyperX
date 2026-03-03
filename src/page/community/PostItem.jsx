import React, { useState, memo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import UserAvatar from "../../components/UserAvatar";
import formatTime from "./formatTime";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Bot,
  EditIcon,
  Trash2,
} from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import PostFormModal from "./PostFormModal";
import { renderContentWithHashtags } from "../../utils/formatters";
import { CommentModal } from "./CommentModal";
import { usePost } from "../../hooks/usePost";

const PostItem = ({
  post: initialPost,
  currentUser,
  onPostDeleted,
  onPostUpdated,
  onTagClick,
}) => {
  const {
    postData,
    likes,
    isLiked,
    comments,
    commentCount,
    loadingComments,
    isSendingComment,
    isDeletingComment,
    isDeletingPost,
    isUpdatingPost,
    fetchCommentsData,
    handleLike,
    handleSendComment,
    executeDeleteComment,
    executeDeletePost,
    executeEditPost,
    handleReplySuccess,
  } = usePost({ initialPost, currentUser });

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [searchParams] = useSearchParams();
  const [editForm, setEditForm] = useState({
    title: initialPost?.title || "",
    content: initialPost?.content || "",
  });

  const isAuthor = currentUser?.id === postData?.user_id;

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) await fetchCommentsData();
    setShowComments((prev) => !prev);
  };

  const highlightCommentId = searchParams.get("commentId");
  useEffect(() => {
    if (highlightCommentId && postData?.id) {
      setShowComments(true);
      const isCommentLoaded = comments.some(
        (c) => String(c.id) === String(highlightCommentId),
      );
      if (!isCommentLoaded) fetchCommentsData();
    }
  }, [highlightCommentId, postData?.id, comments, fetchCommentsData]);

  const requestDeleteComment = (id) => {
    setCommentToDelete(id);
    setDeleteCommentModalOpen(true);
  };

  const requestDeletePost = () => setDeletePostModalOpen(true);

  if (!initialPost || !postData?.id) return null;

  const getProfile = () => {
    return Array.isArray(postData.profiles) ? postData.profiles[0] : postData.profiles;
  };

  const getAvatarUrl = () => {
    const profile = getProfile();
    const metadata = postData.raw_user_meta_data || {};
    return (
      postData.avatar_url ||
      profile?.avatar_url ||
      metadata.avatar_url ||
      metadata.picture
    );
  };

  const getAuthorName = () => {
    const profile = getProfile();
    const metadata = postData.raw_user_meta_data || {};
    return (
      postData.full_name ||
      profile?.full_name ||
      metadata.full_name ||
      "Anonymous"
    );
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${postData.id}`;
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSendCommentWrapper = async () => {
    const { success, error } = await handleSendComment(newComment);
    if (!success && error !== "Empty comment") alert("Error sending comment: " + error);
    if (success) setNewComment("");
  };

  const onDeletePostWrapper = async () => {
    const { success, error } = await executeDeletePost();
    if (success) {
      setDeletePostModalOpen(false);
      if (onPostDeleted) onPostDeleted(postData.id);
    } else {
      alert("Error deleting post: " + error);
    }
  };

  const onEditPostWrapper = async () => {
    const { success, error, updatedPostData } = await executeEditPost(editForm.title, editForm.content);
    if (success) {
      if (onPostUpdated) onPostUpdated(updatedPostData);
      setIsEditing(false);
    } else if (error !== "Empty fields") {
      alert(error);
    }
  };

  const onDeleteCommentWrapper = async () => {
    const success = await executeDeleteComment(commentToDelete);
    if (success) setDeleteCommentModalOpen(false);
  };

  const rootComments = comments.filter((c) => !c.parent_id);

  return (
    <div className="tech-card p-6 md:p-8 rounded-[2.5rem] shadow-2xl hover:border-cyan-500/40 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] transition-all duration-500 relative group overflow-hidden border-white/10">
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <Bot size={120} />
      </div>
      <div className="flex items-start gap-4 z-10 relative">
        <div className="flex-shrink-0 mt-1">
          <UserAvatar
            user={{
              id: postData.user_id,
              avatar_url: getAvatarUrl(),
              raw_user_meta_data: postData.raw_user_meta_data,
              full_name: getAuthorName(),
            }}
            size="lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight tracking-tighter group-hover:text-cyan-400 transition-colors">
                {postData.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span className="text-cyan-300 font-medium hover:underline cursor-pointer">
                  {getAuthorName()}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="font-mono opacity-50 uppercase tracking-widest">
                  [{formatTime(postData.created_at)}]
                </span>
                {postData.updated_at &&
                  postData.updated_at !== postData.created_at && (
                    <span className="italic opacity-60 ml-1">(edited)</span>
                  )}
              </div>
            </div>
            {currentUser && currentUser.id === postData.user_id && (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowPostMenu(!showPostMenu)}
                  className="text-gray-500 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <MoreHorizontal size={20} />
                </button>
                {showPostMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowPostMenu(false)}
                    ></div>
                    <div className="absolute right-0 top-10 z-20 w-40 bg-[#1A1D26] border border-white/10 rounded-xl shadow-2xl py-1 animate-in fade-in zoom-in duration-100">
                      <button
                        onClick={() => {
                          setEditForm({
                            title: postData.title,
                            content: postData.content,
                          });
                          setIsEditing(true);
                          setShowPostMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-cyan-400 hover:bg-white/5 text-left font-medium"
                      >
                        <EditIcon size={14} /> Edit Post
                      </button>
                      <button
                        onClick={() => setDeletePostModalOpen(true)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 text-left font-medium"
                      >
                        <Trash2 size={14} /> Delete Post
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-300 mt-4 whitespace-pre-line leading-relaxed break-words font-light text-base md:text-lg">
            {renderContentWithHashtags(postData.content, onTagClick)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pl-[4rem] md:pl-[5.5rem] relative z-10">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const res = await handleLike();
                if (res?.error) alert(res.error);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all font-black text-xs border uppercase tracking-widest ${isLiked ? "text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "text-gray-500 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"}`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              <span className="tabular-nums">{likes}</span>
            </button>

            <button
              onClick={toggleComments}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all font-black text-xs border uppercase tracking-widest ${showComments ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]" : "text-gray-500 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"}`}
            >
              <MessageCircle size={18} />
              <span className="tabular-nums">{commentCount}</span>
            </button>

            {currentUser && currentUser.id !== postData.user_id && (
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("hyperx-open-chat", {
                      detail: {
                        id: postData.user_id,
                        full_name: getAuthorName(),
                        avatar_url: getAvatarUrl(),
                      },
                    }),
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all font-bold text-sm border text-gray-400 border-white/5 hover:bg-white/5 hover:text-cyan-400 hover:border-cyan-500/20"
                title="Message Author"
              >
                <Send size={18} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className={`flex items-center gap-2 p-2.5 rounded-2xl transition-all border ${showShareMenu ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "text-gray-400 border-white/5 hover:bg-white/5 hover:text-white hover:border-white/10"}`}
            >
              <Share2 size={20} className={showShareMenu ? "scale-110" : ""} />
            </button>

            {showShareMenu && (
               <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowShareMenu(false)}
                ></div>
                <div className="absolute left-0 bottom-full mb-3 w-56 bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    >
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="block font-bold leading-none">
                          {copied ? "Copied!" : "Copy Link"}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          Share via direct URL
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `${window.location.origin}/post/${postData.id}`,
                          "_blank",
                        );
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    >
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                        <ExternalLink size={16} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="block font-bold leading-none">
                          Open in New Tab
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          View full page
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CommentModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postData={postData}
        currentUser={currentUser}
        comments={comments}
        rootComments={rootComments}
        loadingComments={loadingComments}
        newComment={newComment}
        setNewComment={setNewComment}
        onSendComment={onSendCommentWrapper}
        isSendingComment={isSendingComment}
        onDeleteComment={requestDeleteComment}
        onReplySuccess={handleReplySuccess}
        highlightId={highlightCommentId}
        onTagClick={onTagClick}
        getAuthorName={getAuthorName}
        renderContentWithHashtags={renderContentWithHashtags}
        isAuthor={isAuthor}
        onEditPost={() => setIsEditing(true)}
        onDeletePost={requestDeletePost}
      />

      <DeleteConfirmModal
        isOpen={deleteCommentModalOpen}
        onClose={() => setDeleteCommentModalOpen(false)}
        onConfirm={onDeleteCommentWrapper}
        isDeleting={isDeletingComment}
        title="Delete Comment?"
        message="Are you sure?"
      />
      
      <DeleteConfirmModal
        isOpen={deletePostModalOpen}
        onClose={() => setDeletePostModalOpen(false)}
        onConfirm={onDeletePostWrapper}
        isDeleting={isDeletingPost}
        title="Delete Post?"
        message="Are you sure?"
      />

      <PostFormModal
        show={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={onEditPostWrapper}
        form={editForm}
        setForm={setEditForm}
        loading={isUpdatingPost}
        currentUser={currentUser}
        isEdit={true}
      />
    </div>
  );
};

export default memo(PostItem, (prev, next) => {
  return (
    prev.post?.id === next.post?.id &&
    prev.post?.like_count === next.post?.like_count &&
    prev.post?.comment_count === next.post?.comment_count &&
    prev.currentUser?.id === next.currentUser?.id &&
    prev.post?.title === next.post?.title &&
    prev.post?.content === next.post?.content
  );
});
