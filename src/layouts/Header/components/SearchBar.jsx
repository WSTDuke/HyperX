import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import UserAvatar from "../../../components/UserAvatar";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchExpanded,
  setSearchExpanded,
  searchOpen,
  searchRef,
  searchResults,
  isSearching,
}) => {
  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <MagnifyingGlassIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search users by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchExpanded(true)}
          className={`bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
            searchExpanded ? "w-64" : "w-48"
          }`}
        />
      </div>

      <Transition
        show={searchOpen && searchQuery.trim() !== ""}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="absolute left-0 top-14 w-80 bg-[#0B0D14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 text-sm mt-3">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  to={`/profile/${result.id}`}
                  onClick={() => {
                    setSearchQuery("");
                    setSearchExpanded(false);
                  }}
                  className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <UserAvatar
                    user={{
                      raw_user_meta_data: {
                        avatar_url: result.avatar_url,
                        full_name: result.full_name,
                      },
                    }}
                    size="sm"
                    className="w-10 h-10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {result.full_name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {result.email}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No users found</p>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default SearchBar;
