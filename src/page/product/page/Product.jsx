import { useState, useEffect } from "react";
import { supabase } from "../../../routes/supabaseClient";
import ProductSidebar from "./ProductSidebar";
import ProductList from "./ProductList";
import { formatCurrency } from "./format";

const ProductPage = () => {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortOption, setSortOption] = useState("newest");
    const [isLoading, setIsLoading] = useState(false);

    const tagListApplication = ["Software", "Game"];
    const tagListOS = ["Windows", "macOS", "Linux"];

    const sortList = [
        { id: "price_asc", label: "Price: Low to High" },
        { id: "price_desc", label: "Price: High to Low" },
        { id: "free", label: "Free Items" }
    ];

    // Trong Product.jsx

const fetchProducts = async () => {
        setIsLoading(true);
        try {
            let query = supabase.from("products").select("*");

            // 1. Search
            if (search.trim() !== "") {
                query = query.ilike("name", `%${search}%`);
            }

            // 2. Filter Tags (FIX CHO JSONB)
            if (selectedTags.length > 0) {
                const appTags = selectedTags.filter(tag => tagListApplication.includes(tag));
                const osTags = selectedTags.filter(tag => tagListOS.includes(tag));

                // Helper tạo chuỗi query cho JSONB
                // Kết quả sẽ dạng: tag.cs.["Software"],tag.cs.["Game"]
                const buildJsonOrQuery = (tags) => {
                    return tags.map(t => `tag.cs.["${t}"]`).join(',');
                };

                if (appTags.length > 0) {
                    // Dùng .or() với cú pháp contains (cs) cho JSON
                    query = query.or(buildJsonOrQuery(appTags));
                }

                if (osTags.length > 0) {
                    query = query.or(buildJsonOrQuery(osTags));
                }
            }

            // 3. Sort (Giữ nguyên)
            switch (sortOption) {
                case "price_asc": query = query.order("price", { ascending: true }); break;
                case "price_desc": query = query.order("price", { ascending: false }); break;
                case "free": 
                    query = query.eq("price", 0); 
                    query = query.order("created_at", { ascending: false });
                    break;
                default: query = query.order("created_at", { ascending: false }); break;
            }

            const { data, error } = await query;
            if (error) throw error; // Ném lỗi để catch bắt được
            setProducts(data || []);

        } catch (err) {
            console.error("Lỗi Supabase:", err.message, err.details); // In chi tiết lỗi
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchProducts(), 300);
        return () => clearTimeout(timeoutId);
    }, [search, selectedTags, sortOption]);

    const handleTagClick = (tag) => {
        const isAppTag = tagListApplication.includes(tag);
        setSelectedTags((prev) => {
            if (prev.includes(tag)) return prev.filter((t) => t !== tag);
            if (isAppTag) {
                const tagsOnlyOS = prev.filter(t => !tagListApplication.includes(t));
                return [...tagsOnlyOS, tag];
            }
            return [...prev, tag];
        });
    };

    const handleSortClick = (id) => setSortOption(prev => prev === id ? "newest" : id);
    const clearAllFilters = () => { setSelectedTags([]); setSortOption("newest"); };
    const handleSearchSubmit = (e) => { e.preventDefault(); fetchProducts(); };

    return (
        // UPDATE: Thay đổi màu nền từ đen tuyền sang gradient rất nhẹ để tạo chiều sâu
        <div className="bg-gradient-to-br from-[#05050A] via-[#09090b] to-[#05050A] text-gray-300 font-sans h-screen w-screen overflow-hidden flex flex-col  relative isolate">
             
             {/* 1. NOISE TEXTURE: Giúp màu đen không bị lì, trông sang hơn */}
             <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] " style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

             {/* 2. AMBIENT LIGHTS: Màu sắc môi trường */}
             <div className="fixed top-0 left-0 -z-10 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
             <div className="fixed bottom-0 right-0 -z-10 w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

             {/* 3. GRID PATTERN MỜ: Tạo cảm giác công nghệ */}
             <div className="fixed inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            {/* Main Content Area */}
            <div className="flex flex-1 w-full h-full overflow-hidden relative z-10 pt-16 px-12">
                <ProductSidebar 
                    sortList={sortList} 
                    sortOption={sortOption} 
                    tagListApplication={tagListApplication} 
                    selectedTags={selectedTags} 
                    tagListOS={tagListOS} 
                    handleSortClick={handleSortClick} 
                    clearAllFilters={clearAllFilters} 
                    handleTagClick={handleTagClick} 
                />
                
                <div className="flex-1 h-full min-w-0">
                    <ProductList 
                        handleSearchSubmit={handleSearchSubmit} 
                        search={search} 
                        isLoading={isLoading} 
                        products={products} 
                        formatCurrency={formatCurrency} 
                        setSearch={setSearch} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductPage;