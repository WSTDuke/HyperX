import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../routes/supabaseClient";
import ProductSidebar from "./ProductSidebar";
import ProductList from "./ProductList";

const tagListApplication = ["Software", "Game"];
const tagListOS = ["Windows", "macOS", "Linux"];

const ProductPage = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState("name_asc");
  const [isLoading, setIsLoading] = useState(false);


  const sortList = [
    { id: "name_asc", label: "Name: A to Z" },
    { id: "name_desc", label: "Name: Z to A" },
  ];

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("products").select("*");

      if (search.trim() !== "") {
        query = query.ilike("name", `%${search}%`);
      }

      if (selectedTags.length > 0) {
        const appTags = selectedTags.filter((tag) =>
          tagListApplication.includes(tag),
        );
        const osTags = selectedTags.filter((tag) => tagListOS.includes(tag));

        const buildJsonOrQuery = (tags) => {
          return tags.map((t) => `tag.cs.["${t}"]`).join(",");
        };

        if (appTags.length > 0) {
          query = query.or(buildJsonOrQuery(appTags));
        }

        if (osTags.length > 0) {
          query = query.or(buildJsonOrQuery(osTags));
        }
      }

      switch (sortOption) {
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        default:
          query = query.order("name", { ascending: true });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Lỗi Supabase:", err.message, err.details);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedTags, sortOption]);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  const handleTagClick = (tag) => {
    const isAppTag = tagListApplication.includes(tag);
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (isAppTag) {
        const tagsOnlyOS = prev.filter((t) => !tagListApplication.includes(t));
        return [...tagsOnlyOS, tag];
      }
      return [...prev, tag];
    });
  };

  const handleSortClick = (id) =>
    setSortOption((prev) => (prev === id ? "name_asc" : id));
  const clearAllFilters = () => {
    setSelectedTags([]);
    setSortOption("name_asc");
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="bg-[#05050A] h-screen w-screen overflow-hidden text-gray-300 font-sans pt-20 relative isolate flex flex-col">
      {}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {}
      <div className="fixed top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {}
      <div className="flex flex-1 max-w-7xl mx-auto w-full h-full overflow-hidden relative z-10">
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

        <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden">
          <ProductList
            handleSearchSubmit={handleSearchSubmit}
            search={search}
            isLoading={isLoading}
            products={products}
            setSearch={setSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
