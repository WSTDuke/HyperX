import { ArrowUpDown, Tag, X, Filter } from "lucide-react";
import React from "react";

const ProductSidebar = ({
  sortList,
  sortOption,
  tagListApplication,
  selectedTags,
  tagListOS,
  handleSortClick,
  clearAllFilters,
  handleTagClick,
}) => {
  const FilterItem = ({ active, label, onClick, radio }) => (
    <div
      onClick={onClick}
      className={`
                group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 select-none border
                ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300"
                }
            `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
                    w-4 h-4 rounded-${radio ? "full" : "md"} border flex items-center justify-center transition-all duration-500
                    ${active ? "bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "border-white/10 group-hover:border-cyan-500/50"} 
                `}
        >
          {active && (
            <div
              className={`w-1.5 h-1.5 bg-black ${radio ? "rounded-full" : "rounded-sm"}`}
            />
          )}
        </div>
        <span className={`text-xs font-bold uppercase tracking-tight transition-colors ${active ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"}`}>
          {label}
        </span>
      </div>
    </div>
  );

  return (
    <aside className="w-72 h-full hidden lg:flex flex-col flex-shrink-0 border-r border-white/5 bg-black/20">
      <div className="p-6">
        <div className="p-5 tech-card group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Filter size={40} className="text-cyan-500" />
          </div>
          <h2 className="text-white font-black text-lg mb-6 flex items-center gap-2 glow-text-cyan">
            <Filter size={20} className="text-cyan-400" />
            <span className="tracking-tighter uppercase">Filters</span>
          </h2>

          <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1 max-h-[calc(100vh-250px)]">
            {}
            <div>
              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4 px-1">
                <ArrowUpDown size={12} className="text-cyan-500/50" /> Sequencing
              </h3>
              <div className="space-y-1">
                {sortList.map((item) => (
                  <FilterItem
                    key={item.id}
                    label={item.label}
                    active={sortOption === item.id}
                    onClick={() => handleSortClick(item.id)}
                    radio={true}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5 mx-2" />

            {}
            <div>
              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4 px-1">
                <Tag size={12} className="text-cyan-500/50" /> Application
              </h3>
              <div className="space-y-1">
                {tagListApplication.map((tag) => (
                  <FilterItem
                    key={tag}
                    label={tag}
                    active={selectedTags.includes(tag)}
                    onClick={() => handleTagClick(tag)}
                  />
                ))}
              </div>
            </div>

            {}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4 px-1">
                Platform
              </h3>
              <div className="space-y-1">
                {tagListOS.map((tag) => (
                  <FilterItem
                    key={tag}
                    label={tag}
                    active={selectedTags.includes(tag)}
                    onClick={() => handleTagClick(tag)}
                  />
                ))}
              </div>
            </div>
          </div>

          {}
          {(selectedTags.length > 0 || sortOption !== "name_asc") && (
            <button
              onClick={clearAllFilters}
              className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all w-full py-3 rounded-xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
            >
              <X size={14} /> Clear Uplink
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
