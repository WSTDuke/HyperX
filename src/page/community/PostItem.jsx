import { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import formatTime from "./formatTime";
import { Heart, MessageCircle, MoreVertical, Send, Trash2 } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { supabase } from "../../supabaseClient";

const PostItem = ({ post, currentUser, onPostDeleted }) => { // Nhận thêm prop onPostDeleted
    const [likes, setLikes] = useState(post.like_count || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(post.comment_count || 0);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);

    // --- State cho Comment ---
    const [activeMenuCommentId, setActiveMenuCommentId] = useState(null);
    const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [isDeletingComment, setIsDeletingComment] = useState(false);

    // --- State cho Post (MỚI) ---
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        const checkLikeStatus = async () => {
            const { data } = await supabase
                .from("post_likes")
                .select("user_id")
                .eq("post_id", post.id)
                .eq("user_id", currentUser.id)
                .maybeSingle();
            if (data) setIsLiked(true);
        };
        checkLikeStatus();
    }, [currentUser, post.id]);

    const handleLike = async () => {
        if (!currentUser) return alert("Please log in to like posts.");
        if (isLiked) {
            setLikes(prev => prev - 1);
            setIsLiked(false);
            await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", currentUser.id);
        } else {
            setLikes(prev => prev + 1);
            setIsLiked(true);
            await supabase.from("post_likes").insert({ post_id: post.id, user_id: currentUser.id });
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            setLoadingComments(true);
            const { data, error } = await supabase
                .from("comments_view")
                .select("*")
                .eq("post_id", post.id)
                .order("created_at", { ascending: true });

            if (error) console.error("Lỗi load comment:", error);
            else setComments(data || []);
            setLoadingComments(false);
        }
        setShowComments(!showComments);
    };

    const handleSendComment = async () => {
        if (!currentUser) return alert("Please log in to comment.");
        if (!newComment.trim()) return;

        const { data, error } = await supabase
            .from("post_comments")
            .insert({ post_id: post.id, user_id: currentUser.id, content: newComment })
            .select("*")
            .single();

        if (!error && data) {
            const optimisticComment = {
                ...data,
                email: currentUser.email,
                raw_user_meta_data: currentUser.user_metadata || currentUser.raw_user_meta_data
            };
            setComments([...comments, optimisticComment]);
            setNewComment("");
            setCommentCount(prev => prev + 1);
        }
    };

    // --- LOGIC XÓA COMMENT ---
    const requestDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
        setDeleteCommentModalOpen(true);
        setActiveMenuCommentId(null);
    };

    const executeDeleteComment = async () => {
        if (!commentToDelete) return;
        setIsDeletingComment(true);
        const { error } = await supabase.from("post_comments").delete().eq("id", commentToDelete);
        if (error) alert("Error deleting comment: " + error.message);
        else {
            setComments(comments.filter((c) => c.id !== commentToDelete));
            setCommentCount(prev => prev - 1);
            setDeleteCommentModalOpen(false);
            setCommentToDelete(null);
        }
        setIsDeletingComment(false);
    };

    // --- LOGIC XÓA POST (MỚI) ---
    const requestDeletePost = () => {
        setDeletePostModalOpen(true);
        setShowPostMenu(false);
    };

    const executeDeletePost = async () => {
        setIsDeletingPost(true);
        const { error } = await supabase.from("community_posts").delete().eq("id", post.id);

        if (error) {
            alert("Error deleting post: " + error.message);
        } else {
            setDeletePostModalOpen(false);
            if (onPostDeleted) onPostDeleted(post.id); // Gọi callback để xóa post khỏi list ở trang chủ
        }
        setIsDeletingPost(false);
    };

    return (
        <>
            <div className="bg-gray-800/60 border border-gray-700/50 p-6 rounded-xl shadow-md hover:shadow-indigo-500/10 transition duration-300">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <UserAvatar user={{ raw_user_meta_data: post.raw_user_meta_data, email: post.email }} size="md" />
                    </div>
                    <div className="flex-1">
                        {/* Header của bài Post: Tiêu đề + Menu 3 chấm */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold text-indigo-400 mb-1 leading-tight">{post.title}</h3>
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                                    <span className="font-medium text-gray-300">{post.raw_user_meta_data?.full_name || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{formatTime(post.created_at)}</span>
                                </div>
                            </div>

                            {/* --- MENU 3 CHẤM CHO POST (Chỉ hiện nếu là chủ bài viết) --- */}
                            {currentUser && currentUser.id === post.user_id && (
                                <div className="relative ml-2">
                                    <button
                                        onClick={() => setShowPostMenu(!showPostMenu)}
                                        className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {showPostMenu && (
                                        <>
                                            {/* Lớp nền trong suốt tắt menu khi click ra ngoài */}
                                            <div
                                                className="fixed inset-0 z-10 cursor-default"
                                                onClick={() => setShowPostMenu(false)}
                                            ></div>
                                            {/* Menu dropdown */}
                                            <div className="absolute right-0 top-10 z-20 w-32 bg-gray-800 border border-gray-600 rounded shadow-lg py-1">
                                                <button
                                                    onClick={requestDeletePost}
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 text-left transition"
                                                >
                                                    <Trash2 size={14} /> Delete Post
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-gray-300 whitespace-pre-line leading-relaxed">{post.content}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 ml-14">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${isLiked ? "text-pink-500 bg-pink-500/10" : "text-gray-400 hover:bg-gray-700"}`}>
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                        <span>{likes}</span>
                    </button>
                    <button onClick={toggleComments} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${showComments ? "text-indigo-400 bg-indigo-500/10" : "text-gray-400 hover:bg-gray-700"}`}>
                        <MessageCircle size={20} />
                        <span>{commentCount} Comments</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 bg-gray-900/40 rounded-lg p-4 ml-2 sm:ml-14 border border-gray-700/50">
                        <div className="space-y-4 mb-5 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                            {loadingComments ? (
                                <p className="text-sm text-gray-500 italic">Loading conversation...</p>
                            ) : comments.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No comments yet. Be the first!</p>
                            ) : (
                                comments.map((cmt) => (
                                    <div key={cmt.id} className="flex gap-3 group relative">
                                        <div className="flex-shrink-0 pt-1">
                                            <UserAvatar user={{ raw_user_meta_data: cmt.raw_user_meta_data, email: cmt.email }} size="sm" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 inline-block min-w-[200px] relative">
                                                <div className="flex justify-between items-baseline mb-1 gap-4">
                                                    <span className="text-sm font-bold text-indigo-300">
                                                        {cmt.raw_user_meta_data?.full_name || cmt.email?.split('@')[0] || "Anonymous"}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-500">{formatTime(cmt.created_at)}</span>

                                                        {/* --- MENU 3 CHẤM COMMENT --- */}
                                                        {currentUser && currentUser.id === cmt.user_id && (
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setActiveMenuCommentId(activeMenuCommentId === cmt.id ? null : cmt.id)}
                                                                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition"
                                                                >
                                                                    <MoreVertical size={14} />
                                                                </button>
                                                                {activeMenuCommentId === cmt.id && (
                                                                    <>
                                                                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setActiveMenuCommentId(null)}></div>
                                                                        <div className="absolute right-0 top-6 z-20 w-24 bg-gray-800 border border-gray-600 rounded shadow-lg py-1">
                                                                            <button onClick={() => requestDeleteComment(cmt.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-gray-700 text-left transition">
                                                                                <Trash2 size={12} /> Delete
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-200 leading-normal">{cmt.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Input comment section... */}
                        {currentUser ? (
                            <div className="flex gap-3 items-start pt-2 border-t border-gray-700/50">
                                <div className="flex-shrink-0">
                                    <UserAvatar user={currentUser} size="sm" />
                                </div>
                                <div className="flex-1 relative">
                                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="w-full bg-gray-800 border border-gray-600 rounded-full pl-4 pr-12 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition" onKeyDown={(e) => e.key === 'Enter' && handleSendComment()} />
                                    <button onClick={handleSendComment} disabled={!newComment.trim()} className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:bg-transparent disabled:text-gray-500 transition"><Send size={16} /></button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center"><Link to="/signin" className="text-indigo-400 hover:underline">Log in</Link> to join the discussion.</p>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL XÓA COMMENT */}
            <DeleteConfirmModal
                isOpen={deleteCommentModalOpen}
                onClose={() => setDeleteCommentModalOpen(false)}
                onConfirm={executeDeleteComment}
                isDeleting={isDeletingComment}
                title="Delete Comment?"
                message="Are you sure you want to delete this comment? This cannot be undone."
            />

            {/* MODAL XÓA POST (MỚI) */}
            <DeleteConfirmModal
                isOpen={deletePostModalOpen}
                onClose={() => setDeletePostModalOpen(false)}
                onConfirm={executeDeletePost}
                isDeleting={isDeletingPost}
                title="Delete Post?"
                message="Are you sure you want to delete this entire post? All comments and likes will also be removed."
            />
        </>
    );
};

export default PostItem