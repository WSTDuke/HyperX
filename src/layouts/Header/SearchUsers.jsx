import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import UserAvatar from "../../components/UserAvatar";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { useEffect, useRef } from "react";

export const SearchUsers = () => {
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        searchOpen,
        setSearchOpen,
        searchExpanded,
        setSearchExpanded
    } = useSearchUsers("");

    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
                if (!searchQuery) setSearchExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchQuery, setSearchOpen, setSearchExpanded]);

    return (
        <div
            className={`relative group hidden xl:flex items-center transition-all duration-300 ${
                searchExpanded ? "w-[300px]" : "w-10"
            }`}
            ref={searchRef}
        >
            <button
                onClick={() => {
                    setSearchExpanded(true);
                    setTimeout(() => document.getElementById("search-input-header")?.focus(), 100);
                }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10 ${
                    searchExpanded ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
            >
                <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            <div
                className={`flex items-center w-full transition-all duration-300 ${
                    searchExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                    <MagnifyingGlassIcon className="h-6 w-6 text-cyan-400" />
                </div>
                <input
                    id="search-input-header"
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setSearchOpen(true)}
                    className="w-full bg-[#1A1D24] border border-cyan-500/30 text-gray-200 text-sm rounded-full focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 pl-9 py-2 placeholder-gray-500 hover:bg-[#1A1D24]/80 transition-all outline-none shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                />
            </div>

            {searchOpen && (
                <div className="absolute top-full left-0 mt-3 w-full min-w-[340px] bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Results
                        </span>
                        {isSearching && (
                            <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <Link
                                    key={result.id}
                                    to={`/profile/${result.id}`}
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setSearchQuery("");
                                        setSearchExpanded(false);
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                >
                                    <UserAvatar
                                        user={{
                                            id: result.id,
                                            raw_user_meta_data: {
                                                avatar_url: result.avatar_url,
                                                full_name: result.full_name,
                                            },
                                        }}
                                        size="md"
                                        disableLink={true}
                                        className="w-10 h-10 ring-1 ring-white/10"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-bold text-white truncate">
                                            {result.full_name || "Unknown User"}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate">
                                            {result.email}
                                        </p>
                                    </div>
                                    <AtSymbolIcon className="w-4 h-4 text-gray-700" />
                                </Link>
                            ))
                        ) : !isSearching ? (
                            <div className="p-10 text-center flex flex-col items-center gap-3">
                                <div className="p-3 bg-white/5 rounded-full">
                                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
                                </div>
                                <p className="text-sm text-gray-500">No members found.</p>
                            </div>
                        ) : (
                            <div className="p-10 space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 opacity-50">
                                        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse"></div>
                                            <div className="h-2 w-1/3 bg-white/10 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
