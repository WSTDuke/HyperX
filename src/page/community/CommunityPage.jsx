import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../routes/supabaseClient";
import { Search, Plus, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import PostFormModal from "./PostFormModal";
import PostItem from "./PostItem";

export default function Community({ user }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: "", content: "" });
    const [currentUser, setCurrentUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Logic fetch data giữ nguyên
    useEffect(() => {
        const load = async () => {
            let u = user;
            if (!u) {
                const { data } = await supabase.auth.getUser();
                u = data.user;
            }
            setCurrentUser(u);
        };
        load();
    }, [user]);

    const loadPosts = useCallback(async () => {
        const { data, error } = await supabase
            .from("posts_view")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Lỗi tải bài viết:", error);
        else setPosts(data || []);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true); 
            await loadPosts(); 
            setLoading(false);
        };
        fetch();
    }, [loadPosts]);

    const submitPost = async () => {
        if (!currentUser || !currentUser.id) return alert("Lỗi: Không tìm thấy thông tin người dùng!");
        setLoading(true);
        const { error } = await supabase.from("community_posts").insert({ title: form.title, content: form.content, user_id: currentUser.id });
        if (error) alert("Lỗi khi đăng bài: " + error.message);
        else {
            setShowModal(false);
            setForm({ title: "", content: "" });
            setTimeout(() => loadPosts(), 500);
        }
        setLoading(false);
    };

    const handlePostDeleted = (deletedPostId) => {
        setPosts(posts.filter(post => post.id !== deletedPostId));
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        // 1. KEY FIX: h-screen + overflow-hidden (Khóa toàn bộ trang web lại)
        <div className="bg-[#05050A] h-screen w-screen overflow-hidden text-gray-300 font-sans pt-16 relative isolate flex flex-col">
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            <div className="fixed top-0 right-0 -z-10 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[40rem] h-[40rem] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* CONTAINER CHÍNH */}
            <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full h-full px-4 md:px-0 overflow-hidden">
                
                {/* 2. HEADER KHU VỰC COMMUNITY (ĐỨNG YÊN) */}
                {/* flex-shrink-0: Đảm bảo header không bị co lại khi list dài */}
                {/* z-10: Để nổi lên trên khi nội dung bên dưới cuộn qua */}
                <div className="flex-shrink-0 py-6 z-10 relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0B0D14]/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                        
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                <MessageSquare className="text-indigo-500" /> Community Feed
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Share knowledge, ask questions, and connect.</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="relative group flex-1 md:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm transition-all shadow-inner"
                                />
                            </div>

                            {/* Create Post Button */}
                            {currentUser ? (
                                <button 
                                    onClick={() => setShowModal(true)} 
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm whitespace-nowrap"
                                >
                                    <Plus size={18} />
                                    <span className="hidden sm:inline">New Post</span>
                                </button>
                            ) : (
                                <Link to="/signin" className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-medium transition text-sm">
                                    Log in to Post
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. POST LIST (VÙNG CUỘN DUY NHẤT) */}
                {/* flex-1: Chiếm hết phần không gian còn lại */}
                {/* overflow-y-auto: Cho phép cuộn nội dung bên trong */}
                <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar scroll-smooth px-1">
                    {loading && posts.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
                            <p className="text-gray-400">No posts found matching your search.</p>
                        </div>
                    ) : (
                        <div className="space-y-6"> 
                            {filteredPosts.map((post) => (
                                <PostItem key={post.id} post={post} currentUser={currentUser} onPostDeleted={handlePostDeleted} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal vẫn hoạt động bình thường */}
            <PostFormModal show={showModal} onClose={() => setShowModal(false)} onSubmit={submitPost} form={form} setForm={setForm} loading={loading} currentUser={currentUser} />
        </div>
    );
}