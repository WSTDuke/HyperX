import React from "react";
import { Bot } from "lucide-react";

export const PageSkeleton = () => (
  <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto px-4 relative z-10">
    <div className="text-center mb-12 space-y-8 flex flex-col items-center">
      <div className="mb-8 relative flex items-center justify-center">
        <div className="premium-loader" />
        <Bot
          size={32}
          className="absolute text-cyan-400 opacity-20 animate-pulse"
        />
      </div>
      <div className="h-10 md:h-14 w-64 md:w-96 skeleton-cyan rounded-2xl" />
      <div className="space-y-3 mt-4 flex flex-col items-center w-full">
        <div className="h-4 w-72 md:w-[30rem] skeleton-cyan rounded-full opacity-60" />
        <div className="h-4 w-48 md:w-80 skeleton-cyan rounded-full opacity-40" />
      </div>
      <div className="mt-8">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500/50 animate-pulse">
          Loading...
        </span>
      </div>
    </div>
    <div
      className="w-full max-w-3xl h-16 skeleton-cyan rounded-2xl mt-4"
      style={{ opacity: 0.15 }}
    />
  </div>
);
