const UserAvatar = ({ user, size = "md" }) => {
    // Nếu user null hoặc undefined thì render cái gì đó mặc định hoặc return null
    if (!user) return null; 

    // 1. Lấy metadata nếu có (dành cho Current User từ Auth)
    const metadata = user?.raw_user_meta_data || user?.user_metadata || {};

    // 2. Logic lấy Avatar: Ưu tiên lấy trực tiếp (nếu join bảng profiles) -> sau đó mới lấy trong metadata
    const avatarUrl = user.avatar_url || metadata.avatar_url;

    // 3. Logic lấy Tên: Tương tự, ưu tiên full_name ở ngoài -> trong metadata -> email -> dấu hỏi
    const fullName = user.full_name || metadata.full_name || user.email || "?";

    const dims = size === "sm" ? "w-8 h-8" : "w-10 h-10";

    if (avatarUrl) {
        return (
            <img 
                src={avatarUrl} 
                alt={fullName} 
                className={`${dims} rounded-full object-cover border border-gray-600`} 
            />
        );
    }

    return (
        <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff`}
            alt={fullName}
            className={`${dims} rounded-full object-cover border border-gray-600`}
        />
    );
};

export default UserAvatar;