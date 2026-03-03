import React, { useState } from "react";
import { Loader2, Bot, Copy, CircleCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import UserAvatar from "../../../components/UserAvatar";

function splitMarkdownStable(text = "") {
  const count = (re) => (text.match(re) || []).length;
  const ticks = count(/`/g);
  const bold = count(/\*\*/g);
  const italics = count(/(^|[^*])\*([^*]|$)/g);
  const oddOpen = (n) => n % 2 !== 0;
  if (!oddOpen(ticks) && !oddOpen(bold) && !oddOpen(italics))
    return { stable: text, unstable: "" };
  let cutoff = text.length;
  const lastTick = text.lastIndexOf("`");
  const lastBold = text.lastIndexOf("**");
  const lastItalic = text.lastIndexOf("*");
  const candidates = [lastTick, lastBold, lastItalic].filter((v) => v >= 0);
  if (candidates.length > 0) cutoff = Math.min(...candidates);
  if (cutoff < 0 || cutoff >= text.length)
    return { stable: text, unstable: "" };
  return { stable: text.slice(0, cutoff), unstable: text.slice(cutoff) };
}

const escapeMarkdownDuringTyping = (text = "", isTyping = false) => {
  if (!isTyping || !text) return text;
  return text.replace(/\*/g, "\\*").replace(/_/g, "\\_");
};

export const Message = ({ msg, isTyping, currentUser }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = msg.role === "user";

  const bubbleClasses = isUser
    ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-500/20"
    : "bg-[#0B0D14]/80 backdrop-blur-md border border-white/10 text-gray-200 shadow-xl";

  const handleCopy = () => {
    if (isUser || msg.isPlaceholder || msg.isThinking) return;
    navigator.clipboard.writeText(msg.content || "").then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const isAssistantThinking = !isUser && msg.isThinking && isTyping;
  const isAssistantTyping =
    !isUser &&
    msg.isPlaceholder &&
    isTyping &&
    msg.content &&
    (msg.content + "").length > 0;
  const canShowCopyButton =
    !isUser &&
    !msg.isPlaceholder &&
    !msg.isThinking &&
    msg.content &&
    typeof msg.content === "string" &&
    msg.content.trim() !== "";

  return (
    <div
      className={`flex flex-col w-full mb-8 ${isUser ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`flex items-start gap-4 max-w-[90%] md:max-w-[85%] lg:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <UserAvatar user={currentUser} size="sm" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Bot size={18} />
            </div>
          )}
        </div>

        <div
          className={`flex flex-col gap-2 min-w-0 ${isUser ? "items-end" : "items-start"}`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 px-1">
            {isUser ? "You" : "HyperX AI"}
          </span>

          {isUser && msg.imageUrl && (
            <div className="mb-2 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
              <img
                src={msg.imageUrl}
                alt="uploaded"
                className="max-w-[200px] max-h-[200px] object-cover"
              />
            </div>
          )}

          <div
            className={`px-5 py-4 rounded-2xl ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"} ${bubbleClasses} text-sm md:text-base leading-relaxed relative group`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap font-sans">{msg.content}</p>
            ) : (
              <>
                {isAssistantThinking ? (
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest animate-pulse">
                      Thinking...
                    </span>
                  </div>
                ) : (
                  <div className="markdown-content">
                    {(() => {
                      const contentToRender = isAssistantTyping
                        ? escapeMarkdownDuringTyping(msg.content || "", true)
                        : msg.content || "";
                      const { stable, unstable } =
                        splitMarkdownStable(contentToRender);
                      const hasStableContent =
                        stable && stable.trim().length > 0;
                      return (
                        <>
                          {hasStableContent && (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-3 last:mb-0">{children}</p>
                                ),
                                code({
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) {
                                  const match = /language-(\w+)/.exec(
                                    className || "",
                                  );
                                  return !inline ? (
                                    <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#0d1117]">
                                      <div className="bg-[#161b22] px-4 py-2 flex justify-between items-center border-b border-white/5">
                                        <span className="text-xs text-cyan-400 font-mono font-bold lowercase">
                                          {match?.[1] || "code"}
                                        </span>
                                      </div>
                                      <SyntaxHighlighter
                                        language={match?.[1]}
                                        style={oneDark}
                                        PreTag="div"
                                        customStyle={{
                                          margin: 0,
                                          borderRadius: 0,
                                          background: "transparent",
                                          fontSize: "0.85rem",
                                        }}
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, "")}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : (
                                    <code
                                      className="bg-cyan-900/20 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs border border-cyan-500/20"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                },
                                img: ({ src, alt }) => (
                                  <img
                                    src={src}
                                    alt={alt}
                                    className="max-w-full rounded-xl my-3 border border-white/10 shadow-md"
                                  />
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc pl-5 mb-3 space-y-1 marker:text-cyan-500">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-5 mb-3 space-y-1 marker:text-cyan-500">
                                    {children}
                                  </ol>
                                ),
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-500 transition-all"
                                  >
                                    {children}
                                  </a>
                                ),
                                h1: ({ children }) => (
                                  <h1 className="text-2xl font-bold mt-6 mb-3 text-white border-b border-white/10 pb-2">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-xl font-bold mt-5 mb-2 text-white">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-lg font-bold mt-4 mb-2 text-cyan-100">
                                    {children}
                                  </h3>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-cyan-500/50 pl-4 py-1 my-4 bg-cyan-900/10 italic rounded-r-lg text-gray-400">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {stable}
                            </ReactMarkdown>
                          )}
                          {unstable && (
                            <span className="text-cyan-200 animate-pulse">
                              {unstable}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </>
            )}

            {canShowCopyButton && (
              <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-cyan-400 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                >
                  {isCopied ? (
                    <CircleCheck size={12} className="text-green-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                  {isCopied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
