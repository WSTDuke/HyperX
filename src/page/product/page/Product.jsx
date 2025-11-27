import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { Search, Filter, Plus, Package, X, Tag } from "lucide-react";

const ProductPage = () => {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const tagList = ["Shoes", "Shirt", "Pants", "Laptop", "Accessory"];

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            let query = supabase.from("products").select("*");

            if (search.trim() !== "") {
                query = query.ilike("name", `%${search}%`);
            }

            if (selectedTags.length > 0) {
                query = query.in("tag", selectedTags);
            }

            query = query.order("created_at", { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching:", error);
            } else {
                setProducts(data || []);
            }
        } catch (err) {
            // console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedTags]);

    const handleTagClick = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        // 1. Container chính: h-screen và overflow-hidden để khóa scroll body
        <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden pt-16 px-24 pb-12">

            {/* === SIDEBAR (FILTERS) === */}
            {/* Sidebar có thể tự scroll nếu nội dung dài bằng overflow-y-auto */}
            <aside className="w-64 border-r border-slate-800 bg-[#1e293b]/50 hidden md:block flex-shrink-0 overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8 text-indigo-400">
                        <Filter size={20} />
                        <h2 className="font-bold tracking-wider text-sm uppercase">Filters</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-slate-400 text-xs font-semibold uppercase mb-3">Categories</h3>
                            <div className="space-y-2">
                                {tagList.map((tag) => {
                                    const isActive = selectedTags.includes(tag);
                                    return (
                                        <div
                                            key={tag}
                                            onClick={() => handleTagClick(tag)}
                                            className={`
                        group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                        ${isActive
                                                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                                                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"}
                      `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                          w-4 h-4 rounded border flex items-center justify-center transition-colors
                          ${isActive ? "bg-indigo-500 border-indigo-500" : "border-slate-600 group-hover:border-slate-400"}
                        `}>
                                                    {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className="text-sm font-medium">{tag}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedTags.length > 0 && (
                            <button
                                onClick={() => setSelectedTags([])}
                                className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors w-full justify-center pt-4 border-t border-slate-800"
                            >
                                <X size={14} /> Clear all filters
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* === MAIN CONTENT === */}
            {/* 2. Main chuyển thành flex column để chia vùng Header và List */}
            <main className="flex-1 flex flex-col h-full relative">

                {/* 3. VÙNG CỐ ĐỊNH (FIXED HEADER & SEARCH) */}
                {/* flex-shrink-0 đảm bảo vùng này không bị co lại */}
                <div className="p-6 md:px-10 md:py-6 pb-4 flex-shrink-0 bg-[#0f172a] z-10">
                    {/* HEADER AREA */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Products</h1>
                            <p className="text-slate-400 text-sm">Manage and view your inventory.</p>
                        </div>

                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                            <Plus size={18} />
                            <span>New Product</span>
                        </button>
                    </div>

                    {/* SEARCH BAR */}
                    <form onSubmit={handleSearchSubmit} className="relative max-w-2xl group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* 4. VÙNG SCROLL (PRODUCT LIST) */}
                {/* flex-1: chiếm hết chiều cao còn lại */}
                {/* overflow-y-auto: cuộn riêng vùng này */}
                <div className="flex-1 overflow-y-auto p-6 md:px-10 pt-0">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-[#1e293b] rounded-xl p-4 animate-pulse h-80 border border-slate-800">
                                    <div className="w-full h-40 bg-slate-700 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-700 rounded-2xl bg-[#1e293b]/30">
                                    <Package size={64} className="mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No products found</p>
                                    <p className="text-sm">Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                                    {products.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                                        >
                                            <div className="relative aspect-video overflow-hidden bg-slate-800">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                        <Package size={32} />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                    <p className="text-indigo-400 font-bold text-sm">
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="mb-2">
                                                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                                                    {item.description || "No description available."}
                                                </p>
                                                {item.tag && (
                                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-700/50">
                                                        <Tag size={14} className="text-slate-500" />
                                                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                                            {item.tag}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProductPage;