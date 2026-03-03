import { MessageCircle } from "lucide-react";
import { MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon, EllipsisHorizontalIcon, TrashIcon } from "@heroicons/react/24/outline";
import UserAvatar from "../../components/UserAvatar";
import { useState, useEffect, useRef } from "react";

export const MessageDropdown = ({
  user,
  conversations,
  msgOpen,
  setMsgOpen,
  handleOpenChat,
  deleteConvModalOpen,
  setDeleteConvModalOpen,
  setConvToDelete
}) => {
  const [msgSearchQuery, setMsgSearchQuery] = useState("");
  const [showOptionsId, setShowOptionsId] = useState(null);
  const [optionsPos, setOptionsPos] = useState({ top: 0, right: 0 });

  const msgRef = useRef(null);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deleteConvModalOpen) return;
      if (event.target.closest("#fixed-conv-options-menu")) return;

      if (msgRef.current && !msgRef.current.contains(event.target)) {
        setMsgOpen(false);
        setShowOptionsId(null);
      }

      if (!event.target.closest(".conv-options-btn")) {
        setShowOptionsId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [deleteConvModalOpen, setMsgOpen]);

  const handleDeleteClick = (e, conv) => {
    e.stopPropagation();
    setConvToDelete(conv);
    setDeleteConvModalOpen(true);
    setShowOptionsId(null);
  };

  return (
    <div className="relative" ref={msgRef}>
      <button
        onClick={() => setMsgOpen(!msgOpen)}
        className={`relative p-2.5 rounded-full transition-all duration-200 group ${
          msgOpen ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <MessageCircle className="w-5 h-5 transition-colors" />
      </button>

      {msgOpen && (
        <div className="absolute right-0 mt-4 w-[360px] rounded-2xl bg-[#0B0D14] border border-white/10 shadow-2xl z-[110] overflow-hidden origin-top-right animate-in fade-in zoom-in duration-200 ring-1 ring-white/5 font-sans">
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-white">Chats</h3>
            </div>

            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search Messenger"
                value={msgSearchQuery}
                onChange={(e) => setMsgSearchQuery(e.target.value)}
                className="w-full bg-[#1A1D24] text-gray-200 text-sm rounded-full py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-500 border border-white/5"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
            {conversations.filter((c) => {
              if (!msgSearchQuery.trim()) return true;
              const name = c.partner?.full_name?.toLowerCase() || "";
              const email = c.partner?.email?.toLowerCase() || "";
              const q = msgSearchQuery.toLowerCase();
              return name.includes(q) || email.includes(q);
            }).length > 0 ? (
              conversations
                .filter((c) => {
                  if (!msgSearchQuery.trim()) return true;
                  const name = c.partner?.full_name?.toLowerCase() || "";
                  const email = c.partner?.email?.toLowerCase() || "";
                  const q = msgSearchQuery.toLowerCase();
                  return name.includes(q) || email.includes(q);
                })
                .map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleOpenChat(conv.partner, conv.id)}
                    className="flex gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group items-center relative"
                  >
                    <div className="relative flex-shrink-0">
                      <UserAvatar user={conv.partner} size="md" className="w-14 h-14" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-[15px] font-semibold text-white truncate leading-tight mb-0.5">
                        {conv.partner?.full_name || "Instagram User"}
                      </h4>
                      <div className="flex items-center gap-1 text-[13px] text-gray-400">
                        <p
                          className={`truncate max-w-[160px] ${
                            conv.lastMessage?.sender_id !== user?.id && !conv.lastMessage?.is_read
                              ? "text-white font-bold"
                              : ""
                          }`}
                        >
                          {conv.lastMessage?.sender_id === user?.id ? "You: " : ""}
                          {conv.lastMessage?.content || "Sent an attachment"}
                        </p>
                        <span>·</span>
                        <span
                          className={`whitespace-nowrap ${
                            conv.lastMessage?.sender_id !== user?.id && !conv.lastMessage?.is_read
                              ? "text-white font-bold"
                              : ""
                          }`}
                        >
                          {conv.lastMessage
                            ? (() => {
                                const diff =
                                  (new Date() - new Date(conv.lastMessage.created_at)) / 1000 / 60;
                                if (diff < 60) return `${Math.floor(diff)}m`;
                                if (diff < 1440) return `${Math.floor(diff / 60)}h`;
                                return new Date(conv.lastMessage.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                );
                              })()
                            : "Now"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        showOptionsId === conv.id ? "block" : "hidden group-hover:block"
                      }`}
                    >
                      <button
                        className="conv-options-btn p-2 rounded-full bg-[#2a2b2e] hover:bg-[#3e4045] text-white shadow-lg border border-white/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setOptionsPos({
                            top: rect.bottom + 5,
                            right: window.innerWidth - rect.right,
                          });
                          setShowOptionsId(showOptionsId === conv.id ? null : conv.id);
                        }}
                      >
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
                <ChatBubbleLeftEllipsisIcon className="w-12 h-12 opacity-10" />
                <p className="text-sm font-medium">
                  {msgSearchQuery.trim() ? "No results found" : "No recent messages"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showOptionsId && (
        <div
          id="fixed-conv-options-menu"
          ref={optionsMenuRef}
          className="fixed w-32 bg-[#2a2b2e] border border-white/10 rounded-lg shadow-xl z-[200] overflow-hidden py-1 animate-in fade-in zoom-in duration-100"
          style={{ top: optionsPos.top, right: optionsPos.right }}
        >
          <button
            onClick={(e) => {
              const c = conversations.find((x) => x.id === showOptionsId);
              if (c) handleDeleteClick(e, c);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5 flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
