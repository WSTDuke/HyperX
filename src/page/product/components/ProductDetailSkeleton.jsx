import React from "react";

export const ProductDetailSkeleton = () => (
  <main className="bg-[#05050A] min-h-screen pt-20 pb-12 relative isolate overflow-hidden">
    <div
      className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    ></div>
    <div className="p-4 md:px-8 max-w-7xl mx-auto relative z-10">
      <div className="flex justify-between items-center mb-8">
        <div className="h-6 w-32 skeleton rounded-md opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B0D14] p-2 rounded-2xl border border-white/10 shadow-2xl">
            <div className="aspect-square skeleton-cyan rounded-xl"></div>
          </div>
          <div className="bg-[#0B0D14]/60 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full skeleton opacity-50"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 skeleton rounded opacity-30"></div>
              <div className="h-5 w-32 skeleton rounded opacity-50"></div>
              <div className="h-3 w-40 skeleton rounded opacity-20"></div>
            </div>
          </div>
          <div className="h-16 w-full skeleton-cyan rounded-xl"></div>
        </div>

        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="h-7 w-24 skeleton rounded-lg opacity-30"></div>
              <div className="h-7 w-24 skeleton rounded-lg opacity-20"></div>
            </div>
            <div className="h-16 w-3/4 skeleton rounded-xl"></div>
            <div className="h-1 w-20 skeleton rounded-full opacity-40"></div>
            <div className="space-y-3">
              <div className="h-5 w-full skeleton rounded opacity-40"></div>
              <div className="h-5 w-5/6 skeleton rounded opacity-30"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 skeleton rounded-2xl opacity-20"></div>
            <div className="h-24 skeleton rounded-2xl opacity-20"></div>
          </div>

          <div className="h-64 skeleton rounded-2xl opacity-10"></div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-10">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-56 skeleton rounded-xl"></div>
          <div className="flex gap-2">
            <div className="h-10 w-10 skeleton rounded-full opacity-30"></div>
            <div className="h-10 w-10 skeleton rounded-full opacity-30"></div>
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="min-w-[320px] aspect-video skeleton rounded-2xl opacity-20"
            ></div>
          ))}
        </div>
      </div>
    </div>
  </main>
);
