import { ArrowUpDown, Tag, X, Filter } from 'lucide-react';
import React from 'react';

const ProductSidebar = ({ sortList, sortOption, tagListApplication, selectedTags, tagListOS, handleSortClick, clearAllFilters, handleTagClick }) => {
    
    const FilterItem = ({ active, label, onClick, radio }) => (
        <div 
            onClick={onClick}
            className={`
                group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 select-none border
                ${active 
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]" // UPDATED: Cyan styles
                    : "text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/5"}
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`
                    w-4 h-4 rounded-${radio ? 'full' : 'md'} border flex items-center justify-center transition-colors
                    ${active ? "bg-cyan-500 border-cyan-500" : "border-gray-600 group-hover:border-gray-400"} 
                `}>
                    {active && <div className={`w-1.5 h-1.5 bg-black ${radio ? 'rounded-full' : 'rounded-sm'}`} />} 
                </div>
                <span className="text-sm font-medium">{label}</span>
            </div>
        </div>
    );

    return (
        <aside className="w-72 h-full border-r border-white/5 bg-gradient-to-b from-[#0B0D14]/80 to-[#05050A]/80 backdrop-blur-xl hidden lg:flex flex-col flex-shrink-0">
            
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2 text-white">
                    {/* UPDATED: Icon color */}
                    <Filter size={20} className="text-cyan-400" />
                    <h2 className="font-bold text-lg">Filters & Sort</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* SORT SECTION */}
                <div>
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                        <ArrowUpDown size={12} /> Sort By
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

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* TYPE SECTION */}
                <div>
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                        <Tag size={12} /> Type
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

                {/* PLATFORM SECTION */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 px-1">Platform</h3>
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

                {/* CLEAR BUTTON */}
                {(selectedTags.length > 0 || sortOption !== "newest") && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full py-3 rounded-lg border border-red-500/20 mt-4 shadow-lg shadow-red-900/10"
                    >
                        <X size={14} /> Reset Filters
                    </button>
                )}
            </div>
        </aside>
    );
};

export default ProductSidebar;