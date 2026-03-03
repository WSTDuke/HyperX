import {
  Package,
  Plus,
  Search,
  Tag,
  Monitor,
  Gamepad2,
  Box,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProductList = ({
  handleSearchSubmit,
  search,
  isLoading,
  products,
  setSearch,
}) => {
  const getTagIcon = (tag) => {
    if (tag === "Game") return <Gamepad2 size={12} />;
    if (tag === "Software") return <Box size={12} />;
    if (["Windows", "macOS", "Linux"].includes(tag))
      return <Monitor size={12} />;
    return <Tag size={12} />;
  };

  return (
    <main className="flex flex-col h-full relative overflow-hidden bg-transparent">
      {}
      <div className="flex-shrink-0 p-4 md:p-6 z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0B0D14]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl ring-1 ring-white/5">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase glow-text-cyan">
                Product Marketplace
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="relative group flex-1 md:w-72"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  size={16}
                  className="text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Search Products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono text-xs tracking-widest transition-all"
              />
            </form>

            <Link to="/create-product">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-3 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 whitespace-nowrap uppercase tracking-tighter text-sm">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 custom-scrollbar scroll-smooth">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="tech-card rounded-2xl p-4 animate-pulse h-[340px]"
              >
                <div className="w-full h-40 bg-white/5 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded w-full opacity-50"></div>
                  <div className="h-3 bg-white/5 rounded w-5/6 opacity-50"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] text-center max-w-4xl mx-auto">
            <div className="p-4 bg-white/5 rounded-full mb-4 text-gray-600">
              <Package size={32} />
            </div>
            <h3 className="text-white font-bold text-lg">Empty Data Stream</h3>
            <p className="text-gray-500 text-sm">
              No products detected in this sector.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
            {products.map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="group relative block h-full"
              >
                <div className="relative h-full tech-card border-glow-cyan rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  {}
                  <div className="relative aspect-video overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 bg-black/40">
                        <Package size={40} strokeWidth={1} />
                      </div>
                    )}


                    {}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>

                  {}
                  <div className="p-5 flex flex-col flex-1 relative">
                    <h3 className="text-base font-black text-gray-100 group-hover:text-cyan-400 transition-colors line-clamp-1 mb-2 uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed font-medium">
                      {item.description || "NO SYSTEM LOGS AVAILABLE."}
                    </p>

                    {item.tag && item.tag.length > 0 && (
                      <div className="flex items-center gap-2 pt-4 border-t border-white/5 flex-wrap">
                        {item.tag.slice(0, 3).map((t, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-cyan-500/5 text-gray-400 border border-white/5 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all"
                          >
                            {getTagIcon(t)} {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {}
                  <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductList;
