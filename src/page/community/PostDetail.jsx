import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../routes/supabaseClient";
import PostItem from "./PostItem"; 
import { ArrowLeft } from "lucide-react";

const PostDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [post, setPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            const { data, error } = await supabase
                .from('community_posts')
                .select('*, profiles(*)') 
                .eq('id', id)
                .single(); 

            if (error) {
                console.error("Error loading post:", error);
            } else {
                const formattedPost = {
                    ...data,
                    raw_user_meta_data: {
                        full_name: data.profiles?.full_name,
                        avatar_url: data.profiles?.avatar_url
                    },
                    email: data.profiles?.email
                };
                setPost(formattedPost);
            }
            setIsLoading(false);
        };

        if (id) fetchPostDetail();
    }, [id]);

    const handlePostDeleted = () => {
        navigate('/community'); 
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center text-gray-400 gap-4">
                <h2 className="text-xl font-semibold">Post not found</h2>
                <button onClick={() => navigate('/community')} className="text-indigo-400 hover:underline">
                    Back to Community
                </button>
            </div>
        );
    }

    return (
        // BACKGROUND MATCHING COMMUNITY PAGE
        <div className="min-h-screen bg-[#05050A] text-gray-300 pt-24 px-4 pb-10 relative isolate overflow-hidden">
             
             {/* Background Effects */}
             <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
             <div className="fixed top-20 left-1/2 -translate-x-1/2 -z-10 w-[50rem] h-[50rem] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-2xl mx-auto relative z-10">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <PostItem 
                    post={post} 
                    currentUser={currentUser} 
                    onPostDeleted={handlePostDeleted} 
                />
            </div>
        </div>
    );
};

export default PostDetail;