const UserAvatar = ({ user, size = "md" }) => {
    const metadata = user?.raw_user_meta_data || user?.user_metadata || {};
    const avatarUrl = metadata.avatar_url;
    const fullName = metadata.full_name || user?.email || "?";
    const dims = size === "sm" ? "w-8 h-8" : "w-10 h-10";

    if (avatarUrl) {
        return <img src={avatarUrl} alt="Avatar" className={`${dims} rounded-full object-cover border border-gray-600`} />;
    }
    return (
        <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff`}
            alt="Avatar"
            className={`${dims} rounded-full object-cover border border-gray-600`}
        />
    );
};

export default UserAvatar