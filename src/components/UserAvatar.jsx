import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../routes/supabaseClient';

const UserAvatar = ({ user, size = "md", disableLink = false, className = "" }) => {
    if (!user) return null; 

    const metadata = user.raw_user_meta_data || user.user_metadata || {};
    
    const nestedMetadata = metadata.user_metadata || {};
    const profile = Array.isArray(user.profiles) ? user.profiles[0] : (user.profiles || {});
    
    let rawAvatarUrl = user.avatar_url || 
                       metadata.avatar_url || 
                       profile.avatar_url || 
                       profile.picture ||
                       profile.avatar ||
                       metadata.picture || 
                       metadata.avatar ||
                       nestedMetadata.avatar_url || 
                       nestedMetadata.picture ||
                       nestedMetadata.avatar;
    
    const fullName = user.full_name || 
                     profile.full_name || 
                     profile.name ||
                     metadata.full_name || 
                     metadata.name ||
                     nestedMetadata.full_name || 
                     nestedMetadata.name ||
                     user.email || 
                     "U";
    const userId = user.id || user.user_id; 

    const dims = size === "xs" ? "w-6 h-6" : size === "sm" ? "w-8 h-8" : size === "xl" ? "w-32 h-32" : size === "md" ? "w-10 h-10" : "w-12 h-12"; 

    
    const getEffectiveAvatarUrl = (path) => {
        if (!path) {
            return null;
        }
        
        let url = path;
        if (!path.startsWith("http") && !path.startsWith("https")) {
            const cleanPath = path.replace(/^avatars\//, "");
            const { data } = supabase.storage.from('avatars').getPublicUrl(cleanPath);
            url = data.publicUrl;
        }

        // Thêm timestamp để ép browser tải lại ảnh mới (cache busting)
        // Chỉ thêm nếu là ảnh từ Supabase storage để tránh lặp query params nếu path đã có sẵn
        if (url && (url.includes('supabase.co') || url.includes('supabase.net'))) {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}t=${new Date().getTime()}`;
        }
        
        return url;
    };

    const finalAvatarUrl = getEffectiveAvatarUrl(rawAvatarUrl);

    const AvatarImg = (
        <>
            {finalAvatarUrl ? (
                <img 
                    src={finalAvatarUrl} 
                    alt={fullName} 
                    className={`${dims} rounded-full object-cover border border-white/10 hover:opacity-80 transition-opacity bg-gray-800 ${className}`} 
                    onError={(e) => {
                        e.target.onerror = null; 
                        
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0891b2&color=fff&bold=true`;
                    }}
                />
            ) : (
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0891b2&color=fff&bold=true`}
                    alt={fullName}
                    className={`${dims} rounded-full object-cover border border-white/10 hover:opacity-80 transition-opacity ${className}`}
                />
            )}
        </>
    );

    if (userId && !disableLink) {
        return (
            <Link 
                to={`/profile/${userId}`} 
                onClick={(e) => e.stopPropagation()} 
                className={`inline-block relative shrink-0 ${className.includes('w-full') ? 'w-full h-full' : ''}`} 
            >
                {AvatarImg}
            </Link>
        );
    }

    return (
        <div className={`inline-block shrink-0 ${className.includes('w-full') ? 'w-full h-full' : ''}`}>
            {AvatarImg}
        </div>
    );
};

export default UserAvatar;