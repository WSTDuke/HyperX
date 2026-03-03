import React from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";

const ProductCard = ({ item, isSlider }) => (
  <Link
    to={`/product/${item.id}`}
    className={`group relative flex-shrink-0 block h-full ${isSlider ? "w-[280px]" : "w-full"}`}
  >
    <div className="relative h-full bg-[#0B0D14] border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col hover:shadow-xl hover:shadow-cyan-900/10">
      {/* Image */}
      <div className="aspect-[4/3] w-full relative bg-gray-900 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-white/5">
            <Package size={40} opacity={0.5} />
          </div>
        )}

        {/* Verified Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-green-400 border border-white/10 shadow-lg z-10 uppercase tracking-tighter">
          Verified
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold line-clamp-1 group-hover:text-cyan-400 transition-colors mb-2 text-base">
          {item.name}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1 font-light leading-relaxed">
          {item.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          {item.tag && item.tag[0] ? (
            <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10 uppercase font-bold tracking-wide">
              {item.tag[0]}
            </span>
          ) : (
            <span></span>
          )}
          <ChevronRight
            size={16}
            className="text-gray-600 group-hover:text-cyan-400 transition-colors"
          />
        </div>
      </div>
    </div>
  </Link>
);

const ProductsTab = ({ products, activeTab, isLoading }) => {
  if (products.length === 0 && !isLoading) return null;

  return (
    <div className="mb-16 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
            <Package size={22} />
          </div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
        </div>
        {activeTab === "all" && products.length > 4 && (
          <Link
            to="/project"
            className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <div
        className={
          activeTab === "all"
            ? "flex gap-5 overflow-x-auto pb-6 -mx-4 px-4 custom-scrollbar"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {isLoading && products.length === 0
          ? [...Array(activeTab === "all" ? 4 : 6)].map((_, i) => (
              <div
                key={i}
                className={`${activeTab === "all" ? "w-[280px]" : "w-full"} aspect-[4/3] skeleton rounded-2xl`}
              />
            ))
          : products.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                isSlider={activeTab === "all"}
              />
            ))}
      </div>
    </div>
  );
};

export default ProductsTab;
