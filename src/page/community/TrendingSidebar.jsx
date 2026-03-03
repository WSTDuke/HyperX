import React from "react";
import { TrendingUp, ArrowRight, Bot, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingSkeleton = () => (
  <div className="space-y-3 px-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-4 w-full skeleton-cyan rounded-md opacity-50"></div>
    ))}
  </div>
);

export const TrendingSidebar = ({ loading, trendingTags, handleSearchChange }) => {
  return (
    <div className="hidden lg:flex flex-col w-72 p-6 gap-6 overflow-y-auto custom-scrollbar border-r border-white/5 bg-black/20">
      <div className="p-5 tech-card group">
        <div className="absolute top-0 right-0 p-2 opacity-5">
          <TrendingUp size={40} />
        </div>
        <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2 glow-text-cyan">
          <TrendingUp size={20} className="text-cyan-400" />
          <span className="tracking-tighter uppercase">Trending Topics</span>
        </h2>
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between text-[10px] text-gray-600 font-mono uppercase tracking-widest border-b border-white/5 pb-1">
            <span>Signal</span>
            <span>Strength</span>
          </div>
        </div>
        <ul className="space-y-1">
          {loading && trendingTags.length === 0 ? (
            <TrendingSkeleton />
          ) : trendingTags.length > 0 ? (
            trendingTags.map((tag) => (
              <li
                key={tag}
                onClick={() => handleSearchChange(tag)}
                className="flex items-center justify-between text-sm text-gray-400 hover:text-cyan-400 cursor-pointer transition-all px-3 py-2 rounded-lg hover:bg-cyan-500/5 hover:translate-x-1 group/item"
              >
                <span className="truncate">{tag}</span>
                <ArrowRight
                  size={12}
                  className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                />
              </li>
            ))
          ) : (
            <p className="text-[10px] text-gray-600 italic px-2 uppercase tracking-widest font-bold text-center py-4">
              No data streams
            </p>
          )}
        </ul>
      </div>
      <Link
        to="/chatbot-ai"
        className="p-5 tech-card group hover:border-cyan-500/30 transition-all"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Bot size={56} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles size={18} />
            </div>
            <h3 className="text-white font-bold text-sm tracking-tight group-hover:text-cyan-400 transition-colors">
              AI PROMETHEUS
            </h3>
          </div>
          <p className="text-[11px] text-gray-500 mb-6 leading-relaxed opacity-80">
            Lập kế hoạch, giải đáp code và phân tích hệ thống với trí tuệ nhân tạo cấp độ cao.
          </p>
          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-black group-hover:text-white transition-all">
            <span className="uppercase tracking-[0.2em] shadow-cyan-400/50">
              Establish Link
            </span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-2 transition-transform"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
