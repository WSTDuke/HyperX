import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

export const RelatedProducts = ({ relatedProducts, relatedListRef, scroll }) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="border-t border-white/10 pt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">
          Related Products
        </h2>

        <div className="flex items-center gap-4">
          <Link
            to="/product"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View All
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={relatedListRef}
        className="flex gap-6 overflow-x-auto pb-6 snap-x scroll-smooth custom-scrollbar"
      >
        {relatedProducts.map((item) => (
          <Link
            to={`/product/${item.id}`}
            key={item.id}
            className="w-[280px] md:w-[320px] flex-shrink-0 snap-start group block relative"
          >
            <div className="relative h-full tech-card border-glow-cyan rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="aspect-video bg-gray-900 overflow-hidden relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    alt={item.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 bg-black/40">
                    <Package size={24} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-black text-white truncate group-hover:text-cyan-400 transition-colors text-base mb-1 uppercase tracking-tight">
                  {item.name}
                </h3>
                <p className="text-[11px] text-gray-500 truncate font-medium uppercase tracking-tighter">
                  {item.description || "NO DATA"}
                </p>
              </div>

              <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
