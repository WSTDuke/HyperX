import React, { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import ChatInput from "./ChatInput";
import { useChatbotAI } from "../../hooks/useChatbotAI";
import { Message } from "./components/Message";
import { PageSkeleton } from "./components/PageSkeleton";

export default function ChatbotAIPage({ user }) {
  const { state, refs, actions } = useChatbotAI(user);

  const {
    messages,
    isChatStarted,
    input,
    isTyping,
    userProfile,
    alert,
    selectedFile,
    previewUrl,
    isMenuOpen,
    isProfileLoading,
  } = state;

  const { isTypingRef } = refs;

  const {
    setInput,
    setIsMenuOpen,
    handleCancelFile,
    handleFileSelect,
    handleStop,
    handleSendMessage,
  } = actions;

  const msgContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".input-area-wrapper"))
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, setIsMenuOpen]);

  const scrollToBottom = () => {
    const el = msgContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isChatStarted) return;
    const el = msgContainerRef.current;
    if (!el) return;
    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
    if (isBottom) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isChatStarted]);

  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const highlight = () =>
      dropArea.classList.add("border-cyan-500", "bg-cyan-500/5");
    const unhighlight = () =>
      dropArea.classList.remove("border-cyan-500", "bg-cyan-500/5");
    const handleDrop = (e) => {
      preventDefaults(e);
      if (isTypingRef.current) return;
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
      unhighlight();
    };
    ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) =>
      dropArea.addEventListener(evt, preventDefaults),
    );
    ["dragenter", "dragover"].forEach((evt) =>
      dropArea.addEventListener(evt, highlight),
    );
    ["dragleave", "drop"].forEach((evt) =>
      dropArea.addEventListener(evt, unhighlight),
    );
    dropArea.addEventListener("drop", handleDrop);
    return () => {
      try {
        ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) =>
          dropArea.removeEventListener(evt, preventDefaults),
        );
        dropArea.removeEventListener("drop", handleDrop);
      } catch {}
    };
  }, [handleFileSelect, isTypingRef]);

  const onSubmit = (e) => handleSendMessage(e, scrollToBottom);

  return (
    <div className="bg-[#05050A] text-gray-300 font-sans h-screen w-screen overflow-hidden flex flex-col pt-16 relative isolate">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -z-10 w-[60rem] h-[60rem] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 -z-10 w-[50rem] h-[50rem] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {isProfileLoading ? (
        <PageSkeleton />
      ) : isChatStarted ? (
        <div className="mt-6 flex flex-col flex-1 h-full w-full max-w-5xl mx-auto relative z-10">
          <div
            ref={msgContainerRef}
            className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-4 custom-scrollbar scroll-smooth"
          >
            <div className="max-w-3xl mx-auto w-full">
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  msg={msg}
                  currentUser={userProfile}
                  isTyping={isTyping}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="input-area-wrapper w-full pb-6 px-4 md:px-6 pt-2">
            <ChatInput
              isCentered={false}
              isTyping={isTyping}
              alert={alert}
              previewUrl={previewUrl}
              selectedFile={selectedFile}
              input={input}
              setInput={setInput}
              handleSendMessage={onSubmit}
              handleStop={handleStop}
              handleFileSelect={handleFileSelect}
              handleCancelFile={handleCancelFile}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              dropRef={dropRef}
            />
          </div>
        </div>
      ) : (
        <div className=" flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_50px_rgba(34,211,238,0.4)] mb-4 ring-1 ring-white/20">
              <Bot size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Hello,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {userProfile?.full_name || "Creator"}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
              “I’m HyperX AI — built to assist and optimize.”
            </p>
          </div>

          <div className="w-full max-w-3xl input-area-wrapper">
            <ChatInput
              isCentered={true}
              isTyping={isTyping}
              alert={alert}
              previewUrl={previewUrl}
              selectedFile={selectedFile}
              input={input}
              setInput={setInput}
              handleSendMessage={onSubmit}
              handleStop={handleStop}
              handleFileSelect={handleFileSelect}
              handleCancelFile={handleCancelFile}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              dropRef={dropRef}
            />
          </div>
        </div>
      )}
    </div>
  );
}
