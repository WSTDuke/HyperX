import { X } from "lucide-react";
import { Link } from "react-router-dom";

const PostFormModal = ({
  show,
  onClose,
  onSubmit,
  form,
  setForm,
  loading,
  currentUser,
  isEdit = false,
}) => {
  if (!show) return null;

  const modalTitle = isEdit ? "Edit Post" : "Create New Post";
  const buttonText = isEdit
    ? loading
      ? "Updating..."
      : "Update Post"
    : loading
      ? "Posting..."
      : "Submit Post";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {}
      <div className="relative tech-card border-cyan-500/20 w-full max-w-lg mx-auto rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        {}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/5"
        >
          <X size={20} />
        </button>

        {}
        <h2 className="text-xl font-black text-white mb-8 pb-4 border-b border-white/5 uppercase tracking-tighter glow-text-cyan flex items-center justify-between">
          <span>{modalTitle}</span>
        </h2>

        {!currentUser ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              You need to be logged in to post.
            </p>
            {}
            <Link
              to="/signin"
              className="inline-block px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              Log in now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {}
            <div>
              <input
                type="text"
                placeholder="Enter a clear and descriptive title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-black text-xs tracking-widest"
                autoFocus
              />
            </div>

            {}
            <div>
              <textarea
                placeholder="Describe the data you want to transmit (Markdown supported)..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full p-5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none leading-relaxed custom-scrollbar text-sm"
              ></textarea>
            </div>

            {}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              {}
              <button
                onClick={onSubmit}
                disabled={loading || !form.title.trim() || !form.content.trim()}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none uppercase tracking-tighter text-sm"
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
