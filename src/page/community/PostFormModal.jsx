import { X } from "lucide-react";
import { Link } from "react-router-dom";

const PostFormModal = ({ show, onClose, onSubmit, form, setForm, loading, currentUser, isEdit = false }) => {
    if (!show) return null;
    
    // Logic xác định tiêu đề và nút bấm
    const modalTitle = isEdit ? "Edit Post" : "Create New Post";
    const buttonText = isEdit ? (loading ? "Updating..." : "Update Post") : (loading ? "Posting..." : "Submit Post");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Backdrop làm mờ & tối nền */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#0B0D14] border border-white/10 w-full max-w-lg mx-auto rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/5"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10">
                    {modalTitle}
                </h2>

                {!currentUser ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">You need to be logged in to post.</p>
                        <Link 
                            to="/signin" 
                            className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            Log in now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Title Input */}
                        <div>
                            <input
                                type="text"
                                placeholder="Post Title..."
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full p-3.5 rounded-xl bg-[#05050A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                autoFocus
                            />
                        </div>

                        {/* Content Input */}
                        <div>
                            <textarea
                                placeholder="What's on your mind? (Markdown supported)"
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                rows={8}
                                className="w-full p-3.5 rounded-xl bg-[#05050A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed custom-scrollbar"
                            ></textarea>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                onClick={onClose} 
                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-medium rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={onSubmit} 
                                disabled={loading || !form.title.trim() || !form.content.trim()} 
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostFormModal;