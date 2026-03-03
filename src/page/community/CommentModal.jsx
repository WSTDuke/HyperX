import React, { useState, memo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { MessageCircle, X, MoreHorizontal, EditIcon, Trash2, Send } from "lucide-react";
import UserAvatar from "../../components/UserAvatar";
import formatTime from "./formatTime";
import { CommentItem } from "./CommentItem";

export const CommentModal = memo(
  ({
    isOpen,
    onClose,
    postData,
    currentUser,
    comments,
    rootComments,
    loadingComments,
    newComment,
    setNewComment,
    onSendComment,
    isSendingComment,
    onDeleteComment,
    onReplySuccess,
    highlightId,
    onTagClick,
    getAuthorName,
    renderContentWithHashtags,
    isAuthor,
    onEditPost,
    onDeletePost,
  }) => {
    const [showPostMenu, setShowPostMenu] = useState(false);
    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-[#05050A]/60 backdrop-blur-xl animate-in fade-in duration-500"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-2xl max-h-[85vh] tech-card rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300 border-cyan-500/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#0B0D14]/50 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <MessageCircle size={20} />
              </div>
              <h3 className="text-lg font-black text-white tracking-tighter uppercase glow-text-cyan">
                Data Stream
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 md:p-8 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
              <div className="flex items-start gap-4 md:gap-5">
                <UserAvatar user={postData.profiles} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-cyan-400 font-bold hover:underline cursor-pointer">
                        {getAuthorName()}
                      </span>
                      <div className="flex items-center gap-2 text-gray-500 text-[10px] mt-0.5 font-medium uppercase tracking-wider">
                        <span>{formatTime(postData.created_at)}</span>
                        {postData.updated_at && (
                          <span className="flex items-center gap-1">
                            • edited
                          </span>
                        )}
                      </div>
                    </div>

                    {isAuthor && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPostMenu(!showPostMenu);
                          }}
                          className={`p-2 rounded-xl transition-all ${showPostMenu ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/5 hover:text-white"}`}
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {showPostMenu && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setShowPostMenu(false)}
                            ></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in zoom-in-95 fade-in duration-200">
                              <div className="p-1.5">
                                <button
                                  onClick={() => {
                                    onEditPost();
                                    setShowPostMenu(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                  <EditIcon
                                    size={16}
                                    className="text-cyan-400"
                                  />
                                  <span className="font-bold">Edit Post</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onDeletePost();
                                    setShowPostMenu(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all"
                                >
                                  <Trash2 size={16} />
                                  <span className="font-bold">Delete Post</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 break-words leading-tight">
                    {postData.title}
                  </h2>

                  <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line break-words opacity-90">
                    {renderContentWithHashtags(postData.content, onTagClick)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-white/5"></span>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <MessageCircle size={14} /> Discussions
                </span>
                <span className="h-px flex-1 bg-white/5"></span>
              </div>

              {loadingComments ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">
                    Syncing talks...
                  </p>
                </div>
              ) : rootComments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10 group">
                    <MessageCircle
                      size={28}
                      className="text-gray-700 group-hover:text-cyan-500 transition-colors"
                    />
                  </div>
                  <p className="text-gray-500 text-sm italic">
                    Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {rootComments.map((cmt) => (
                    <CommentItem
                      key={cmt.id}
                      comment={cmt}
                      allComments={comments}
                      currentUser={currentUser}
                      onDelete={onDeleteComment}
                      onReplySuccess={onReplySuccess}
                      depth={0}
                      highlightId={highlightId}
                      onTagClick={onTagClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-black/40 border-t border-white/5 z-20">
            {currentUser ? (
              <div className="flex gap-4 items-start">
                <div className="hidden sm:block">
                  <UserAvatar
                    user={{
                      ...currentUser,
                      id: currentUser.id,
                      avatar_url:
                        currentUser.user_metadata?.avatar_url ||
                        currentUser.user_metadata?.picture,
                    }}
                    size="md"
                  />
                </div>
                <div className="flex-1 relative group">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your thought..."
                    className="w-full bg-[#05050A] border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder-gray-600 resize-none min-h-[56px] max-h-[150px]"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), onSendComment())
                    }
                    disabled={isSendingComment}
                  />
                  <button
                    onClick={onSendComment}
                    disabled={!newComment.trim() || isSendingComment}
                    className="absolute right-3 bottom-3 p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl text-white hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/5 rounded-2xl text-center border border-dashed border-white/10 hover:border-cyan-500/30 transition-colors">
                <p className="text-xs text-gray-500 italic">
                  Want to join?{" "}
                  <Link
                    to="/signin"
                    className="text-cyan-400 font-bold hover:underline not-italic"
                  >
                    Sign in
                  </Link>{" "}
                  to share your insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);
