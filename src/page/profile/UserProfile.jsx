import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import UserAvatar from "../community/UserAvatar";
import PostItem from "../community/PostItem";
import { 
    Calendar, Mail, Edit3, LogOut, 
    Grid, Activity, UserX, Package, ChevronRight, Tag, ArrowLeft, UserPlus, UserCheck 
} from "lucide-react";
import formatTime from "../community/formatTime"; 

const UserProfile = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [products, setProducts] = useState([]); 
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // --- STATE CHO FOLLOW ---
    const [isFollowing, setIsFollowing] = useState(false);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

    // State Tab
    const [activeTab, setActiveTab] = useState('all'); 
    const [selectedPostId, setSelectedPostId] = useState(null);

    const [stats, setStats] = useState({ 
        postCount: 0, 
        likeCount: 0, 
        productCount: 0,
        followerCount: 0, 
        followingCount: 0 
    });

    const formatCurrency = (amount) => {
        if (amount === 0 || amount === undefined) return "Free";
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            
            // Lấy thông tin user hiện tại (Bước 1 - không đồng bộ)
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            const targetUserId = id || user?.id;

            if (!targetUserId) {
                setIsLoading(false);
                return;
            }

            try {
                // 2. Lấy Profile (Cần thiết để lấy email cho sản phẩm)
                const profilePromise = supabase.from('profiles').select('*').eq('id', targetUserId).single();
                
                // 3. Chuẩn bị các Promise song song
                const postsPromise = supabase.from('community_posts').select('*, profiles(*)').eq('user_id', targetUserId).order('created_at', { ascending: false });
                const followerCountPromise = supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', targetUserId);
                const followingCountPromise = supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', targetUserId);
                
                // 4. Thực thi Profile và các Promise độc lập khác song song
                const [
                    { data: profileData, error: profileError }, 
                    { data: postsData, error: postsError }, 
                    { count: followerCount }, 
                    { count: followingCount }
                ] = await Promise.all([
                    profilePromise,
                    postsPromise,
                    followerCountPromise,
                    followingCountPromise,
                ]);

                if (profileError) throw profileError;
                if (postsError) throw postsError;

                setProfile(profileData);

                // 5. Lấy Products (Phụ thuộc vào email của profile)
                let productsData = [];
                let productCount = 0;
                if (profileData?.email) {
                    const { data: prodData, error: prodError } = await supabase.from('products').select('*').eq('email_upload', profileData.email).order('created_at', { ascending: false });
                    if (prodError) throw prodError;
                    productsData = prodData || [];
                    productCount = productsData.length;
                }
                setProducts(productsData);

                // 6. Xử lý Posts và Stats
                const formattedPosts = postsData.map(post => ({
                    ...post,
                    raw_user_meta_data: { full_name: post.profiles?.full_name, avatar_url: post.profiles?.avatar_url },
                    email: post.profiles?.email
                }));
                setPosts(formattedPosts);

                setStats({
                    postCount: postsData.length,
                    likeCount: formattedPosts.reduce((acc, curr) => acc + (curr.like_count || 0), 0),
                    productCount: productCount,
                    followerCount: followerCount || 0,
                    followingCount: followingCount || 0
                });

                // 7. Kiểm tra trạng thái Follow (Nếu đang xem profile người khác) - Chạy song song
                if (user && user.id !== targetUserId) {
                    const { data: followData } = await supabase
                        .from('follows')
                        .select('follower_id')
                        .eq('follower_id', user.id)
                        .eq('following_id', targetUserId)
                        .maybeSingle();
                    
                    setIsFollowing(!!followData);
                }

            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/signin');
    };

    // Thêm logic cập nhật post sau khi chỉnh sửa
    const handlePostUpdated = (updatedPost) => {
        setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p));
    };

    const handlePostDeleted = (deletedPostId) => {
        setPosts(posts.filter(p => p.id !== deletedPostId));
        setStats(prev => ({ ...prev, postCount: prev.postCount - 1 }));
        if (selectedPostId === deletedPostId) setSelectedPostId(null);
    };

    // --- LOGIC FOLLOW / UNFOLLOW ---
    const handleFollowToggle = async () => {
        if (!currentUser) return alert("Please log in to follow.");
        if (isUpdatingFollow) return;

        setIsUpdatingFollow(true);
        // Lưu trạng thái cũ để revert nếu lỗi
        const previousIsFollowing = isFollowing;
        const previousCount = stats.followerCount;

        // Optimistic Update (Cập nhật giao diện ngay lập tức)
        if (isFollowing) {
            setIsFollowing(false);
            setStats(prev => ({ ...prev, followerCount: prev.followerCount - 1 }));
        } else {
            setIsFollowing(true);
            setStats(prev => ({ ...prev, followerCount: prev.followerCount + 1 }));
        }

        try {
            if (previousIsFollowing) {
                // Đang follow -> Muốn Unfollow
                const { error } = await supabase.from('follows').delete()
                    .eq('follower_id', currentUser.id)
                    .eq('following_id', profile.id);
                if (error) throw error;
            } else {
                // Chưa follow -> Muốn Follow
                const { error } = await supabase.from('follows').insert({
                    follower_id: currentUser.id,
                    following_id: profile.id
                });
                if (error) throw error;
            }
        } catch (error) {
            console.error("Follow error:", error);
            // Revert nếu lỗi
            setIsFollowing(previousIsFollowing);
            setStats(prev => ({ ...prev, followerCount: previousCount }));
            alert("Unable to update follow status.");
        } finally {
            setIsUpdatingFollow(false);
        }
    };

    const handleTabChange = (tabName) => {
        if (activeTab === tabName) {
            setActiveTab('all');
        } else {
            setActiveTab(tabName);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-indigo-400"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
    if (!profile) return <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-gray-400 gap-4"><UserX size={64} /><h2 className="text-xl font-semibold">User not found</h2><button onClick={() => navigate('/')} className="text-indigo-400 hover:underline">Go Home</button></div>;

    const isOwnProfile = currentUser && currentUser.id === profile.id;

    // View Chi tiết bài viết (Focus View)
    if (selectedPostId) {
        const selectedPost = posts.find(p => p.id === selectedPostId);
        return (
            <div className="min-h-screen bg-[#0f172a] text-gray-100 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => setSelectedPostId(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} /> Back to Profile
                    </button>
                    {selectedPost ? <PostItem post={selectedPost} currentUser={currentUser} onPostDeleted={handlePostDeleted} onPostUpdated={handlePostUpdated} /> : <div className="text-center text-gray-500">Post not found</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* --- HEADER PROFILE --- */}
                <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 opacity-50"></div>
                    <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 pt-10">
                        <div className="relative group">
                            <div className="p-1 bg-gray-900 rounded-full">
                                <UserAvatar user={{ raw_user_meta_data: { avatar_url: profile.avatar_url, full_name: profile.full_name }, email: profile.email }} size="xl" className="w-32 h-32 text-4xl" />
                            </div>
                            {isOwnProfile && <button onClick={() => navigate('/setting')} className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition shadow-lg border-4 border-gray-900"><Edit3 size={16} /></button>}
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2 mb-2">
                            <h1 className="text-3xl font-bold text-white">{profile.full_name || "Unknown User"}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5"><Mail size={16} className="text-indigo-400" /><span>{profile.email}</span></div>
                                <div className="flex items-center gap-1.5"><Calendar size={16} className="text-indigo-400" /><span>Joined {new Date(profile.created_at || Date.now()).toLocaleDateString()}</span></div>
                            </div>
                        </div>
                        
                        {/* --- ACTIONS BUTTONS --- */}
                        <div className="flex flex-col gap-3 min-w-[140px]">
                            {isOwnProfile ? (
                                <>
                                    <button onClick={() => navigate('/setting')} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition flex items-center justify-center gap-2">
                                        <Edit3 size={18} /> Edit Profile
                                    </button>
                                    <button onClick={handleSignOut} className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition flex items-center justify-center gap-2">
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleFollowToggle}
                                    disabled={isUpdatingFollow}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-lg 
                                    ${isFollowing 
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600' // Style nút Unfollow
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30' // Style nút Follow
                                    }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserCheck size={18} /> Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={18} /> Follow
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* --- STATS BAR --- */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-700/50 pt-6">
                        {/* PRODUCTS */}
                        <button 
                            onClick={() => handleTabChange('products')} 
                            className={`text-center p-3 rounded-xl transition-all duration-300 border ${activeTab === 'products' ? 'bg-gray-800 border-green-500/50 shadow-lg shadow-green-500/10' : 'bg-gray-900/30 border-transparent hover:bg-gray-800/50'}`}
                        >
                            <span className="block text-2xl font-bold text-white">{stats.productCount}</span>
                            <span className="text-xs uppercase tracking-wider font-semibold text-green-400">Products</span>
                        </button>

                        {/* POSTS */}
                        <button 
                            onClick={() => handleTabChange('posts')} 
                            className={`text-center p-3 rounded-xl transition-all duration-300 border ${activeTab === 'posts' ? 'bg-gray-800 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-gray-900/30 border-transparent hover:bg-gray-800/50'}`}
                        >
                            <span className="block text-2xl font-bold text-white">{stats.postCount}</span>
                            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Posts</span>
                        </button>

                        {/* FOLLOWERS */}
                        <div className="text-center p-3 bg-gray-900/30 rounded-xl border border-transparent cursor-default">
                            <span className="block text-2xl font-bold text-white">{stats.followerCount}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider text-blue-400">Followers</span>
                        </div>

                        {/* FOLLOWING */}
                        <div className="text-center p-3 bg-gray-900/30 rounded-xl border border-transparent cursor-default">
                            <span className="block text-2xl font-bold text-white">{stats.followingCount}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider text-pink-400">Following</span>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT SECTION --- */}

                {/* 1. PRODUCTS */}
                {(activeTab === 'all' || activeTab === 'products') && products.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                            <div className="flex items-center gap-2 text-xl font-bold text-white"><Package className="text-green-400" /><h2>Products</h2></div>
                            {activeTab === 'all' && products.length > 4 && <Link to="/product" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">View all <ChevronRight size={16} /></Link>}
                        </div>
                        {activeTab === 'all' ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}>
                                {products.map((item) => <ProductCard key={item.id} item={item} formatCurrency={formatCurrency} />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((item) => <ProductCard key={item.id} item={item} formatCurrency={formatCurrency} />)}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. POSTS */}
                {(activeTab === 'all' || activeTab === 'posts') && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center gap-2 text-xl font-bold text-white border-b border-gray-700 pb-4">
                            <Grid className="text-indigo-400" />
                            <h2>User Posts</h2>
                        </div>
                        {posts.length > 0 ? (
                            <div className="grid gap-6">
                                {posts.map(post => (
                                    <div key={post.id} className="relative group">
                                        {/* Đã thêm onPostUpdated vào PostItem */}
                                        <PostItem post={post} currentUser={currentUser} onPostDeleted={handlePostDeleted} onPostUpdated={handlePostUpdated} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                <Activity className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                                <h3 className="text-lg font-medium text-gray-400">No posts yet</h3>
                                <p className="text-gray-500">This user hasn't shared anything yet.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

// --- SUB-COMPONENT: Product Card ---
const ProductCard = ({ item, formatCurrency }) => (
    <Link to={`/product/${item.id}`} className="group relative flex-shrink-0 block w-[260px] md:w-[280px] snap-start h-full">
        <div className="bg-gray-800 border border-gray-700/50 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 h-full flex flex-col">
            <div className="aspect-video bg-gray-700 relative overflow-hidden">
                {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-gray-600"><Package size={32} /></div>}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-400 border border-white/10">{formatCurrency(item.price)}</div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-white font-semibold line-clamp-1 group-hover:text-green-400 transition-colors mb-1">{item.name}</h3>
                <p className="text-gray-400 text-xs line-clamp-2 mb-3 flex-1">{item.description || "No description"}</p>
                {item.tag && item.tag.length > 0 && (
                    <div className="flex gap-2 mt-auto">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-300 border border-gray-600 flex items-center gap-1"><Tag size={10} /> {item.tag[0]}</span>
                        {item.tag.length > 1 && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-300 border border-gray-600">+{item.tag.length - 1}</span>}
                    </div>
                )}
            </div>
        </div>
    </Link>
);

export default UserProfile;