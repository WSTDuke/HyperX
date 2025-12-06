// ChatbotAIPage.jsx - FIXED VERSION
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  Loader2,
  User,
  Bot,
  ClipboardCopy,
  Check,
  Image as ImageIcon,
  StopCircle,
  X,
  CirclePause,
  Pause,
  Copy,
  PlusCircle,
  CircleCheck,
} from "lucide-react";
import { supabase } from '../../routes/supabaseClient';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import UserAvatar from '../../page/community/UserAvatar'

// -------------------- CONFIG --------------------
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || "";
const apiKey = getApiKey();
const modelName = "gemini-2.5-flash";
const apiUrlBase = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
const apiUrl = `${apiUrlBase}${apiKey ? `?key=${apiKey}` : ""}`;

const MAX_HISTORY_TURNS = 5;
const initialMessages = [];
const systemInstruction = "You are HyperX, a helpful and knowledgeable AI assistant. Answer in Vietnamese.";

// -------------------- HELPERS --------------------
const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function splitMarkdownStable(text = "") {
  const count = (re) => (text.match(re) || []).length;
  const ticks = count(/`/g);
  const bold = count(/\*\*/g);
  const italics = count(/(^|[^*])\*([^*]|$)/g);

  const oddOpen = (n) => n % 2 !== 0;
  if (!oddOpen(ticks) && !oddOpen(bold) && !oddOpen(italics)) {
    return { stable: text, unstable: "" };
  }

  let cutoff = text.length;
  const lastTick = text.lastIndexOf("`");
  const lastBold = text.lastIndexOf("**");
  const lastItalic = text.lastIndexOf("*");

  const candidates = [lastTick, lastBold, lastItalic].filter((v) => v >= 0);
  if (candidates.length > 0) {
    cutoff = Math.min(...candidates);
  }

  if (cutoff < 0 || cutoff >= text.length) {
    return { stable: text, unstable: "" };
  }

  return {
    stable: text.slice(0, cutoff),
    unstable: text.slice(cutoff),
  };
}

const escapeMarkdownDuringTyping = (text = "", isTyping = false) => {
  if (!isTyping || !text) return text;
  return text.replace(/\*/g, "\\*").replace(/_/g, "\\_");
};

// -------------------- COMPONENTS --------------------

const Message = ({ msg, isLast, isTyping, currentUser }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = msg.role === "user";
  const alignment = isUser ? "self-end" : "self-start";
  const bubbleMaxWidth = isUser ? "max-w-[85%]" : "max-w-[85%] sm:max-w-[70%]";

  const handleCopy = () => {
    if (isUser || msg.isPlaceholder || msg.isThinking) return; 
    
    const contentToCopy = msg.content || "";
    
    navigator.clipboard.writeText(contentToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const bubbleClasses = isUser ? "bg-indigo-600 rounded-tr-none text-white border-none" : "bg-gray-800 rounded-tl-none text-gray-200 border border-gray-700";

  const isAssistantThinking = !isUser && msg.isThinking && isTyping;
  const isAssistantTyping = !isUser && msg.isPlaceholder && isTyping && msg.content && (msg.content + "").length > 0;
  
  let displayContent = msg.content || "";
  
  if (isAssistantThinking) {
      displayContent = "Đang suy nghĩ...";
  } else if (isAssistantTyping) {
      displayContent = escapeMarkdownDuringTyping(msg.content || "", true);
  } else if (!isUser) {
      displayContent = msg.content || "";
  }

  // FIX: Kiểm tra an toàn cho canShowCopyButton
  const canShowCopyButton = !isUser && 
                           !msg.isPlaceholder && 
                           !msg.isThinking && 
                           msg.content && 
                           typeof msg.content === 'string' && 
                           msg.content.trim() !== "";

  return (
    <div className={`flex flex-col w-full ${alignment} mb-4 group`}>
      {msg.imageUrl && (
        <div className={`mb-2 mr-13 ${isUser ? "self-end" : "self-start"}`}>
          <img src={msg.imageUrl} alt="uploaded" className="rounded-lg max-w-[160px] shadow-md" />
        </div>
      )}

      <div className={`flex items-start gap-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0 mr-1 ml-1">
          {isUser ? <UserAvatar user={currentUser} size="sm" /> : <div className="w-10 h-10 p-2 rounded-full bg-gray-700 text-white flex items-center justify-center"><Bot size={18} /></div>}
        </div>

        <div className={`${bubbleMaxWidth} p-4 rounded-xl shadow-lg transition-all duration-300 ${bubbleClasses}`}>
          {isUser ? (
            msg.content && <p className="text-sm whitespace-pre-line leading-relaxed font-sans">{msg.content}</p>
          ) : (
            <>
              {isAssistantThinking ? (
                <div className="flex items-center text-sm text-gray-300">
                  <Loader2 size={16} className="animate-spin mr-2 text-pink-400" />
                  <span className="animate-pulse">{displayContent}</span>
                </div>
              ) : (
                (() => {
                  const contentToRender = isAssistantTyping ? escapeMarkdownDuringTyping(msg.content || "", true) : msg.content || "";
                  const { stable, unstable } = splitMarkdownStable(contentToRender);
                  const hasStableContent = stable && stable.trim().length > 0;
                  
                  return (
                    <>
                      {hasStableContent && (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            p: ({ node, children, ...props }) => {
                              return <p {...props} className="text-sm whitespace-pre-line leading-relaxed font-sans">{children}</p>;
                            },
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || "");
                              return !inline ? (
                                <SyntaxHighlighter language={match?.[1]} style={oneDark} PreTag="div" {...props}>
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-gray-700 px-1 py-0.5 rounded" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            img({ src, alt }) {
                              return <img src={src} alt={alt} className="max-w-full rounded-md" />;
                            },
                          }}
                        >
                          {stable}
                        </ReactMarkdown>
                      )}

                      {unstable && <span className="text-gray-300 whitespace-pre-wrap break-words">{unstable}</span>}

                      {!hasStableContent && !unstable && !msg.isPlaceholder && (
                          <span className="text-sm text-gray-300">Không nhận được phản hồi.</span>
                      )}
                    </>
                  );
                })()
              )}
            </>
          )}
        </div>
      </div>
      
      {canShowCopyButton && (
        <div className={`mt-1 flex items-center ${isUser ? "self-end" : "self-start"} ml-11`}>
            <button
              onClick={handleCopy}
              className={`flex items-center text-xs p-1 rounded-md transition duration-200 ml-4
                ${isCopied ? "bg-green-700/50 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
              `}
            >
              {isCopied ? <CircleCheck size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
              {isCopied ? "Đã sao chép!" : "Sao chép"}
            </button>
        </div>
      )}
    </div>
  );
};

// -------------------- Menu Upload Component --------------------

const UploadMenu = React.memo(({ isMenuOpen, handleMenuOptionClick }) => {
    if (!isMenuOpen) return null;

    return (
        <div className="absolute bottom-full left-0 mb-3 w-40 rounded-lg shadow-2xl bg-gray-800 border border-gray-700 overflow-hidden z-20 transition-opacity duration-200">
            <button
                onClick={() => handleMenuOptionClick("image")}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition"
            >
                <ImageIcon size={18} className="mr-3 text-pink-400" />
                Upload Ảnh
            </button>
            <button
                onClick={() => handleMenuOptionClick("file")}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition"
            >
                <span className="mr-3 text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12H7"/><path d="M17 16H7"/><path d="M17 20H7"/></svg>
                </span>
                Upload Tệp
            </button>
        </div>
    );
});

// -------------------- InputArea Component (Memoized) --------------------
const MemoizedInputArea = React.memo(({
  isCentered,
  isTyping,
  alert,
  previewUrl,
  selectedFile,
  input,
  setInput,
  handleSendMessage,
  handleStop,
  handleFileSelect,
  handleCancelFile,
  dropRef,
  isMenuOpen,
  setIsMenuOpen
}) => {

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const handleCancel = useCallback(() => {
      handleCancelFile();
      if (imageInputRef.current) imageInputRef.current.value = null;
      if (fileInputRef.current) fileInputRef.current.value = null;
  }, [handleCancelFile]);

  const toggleMenu = useCallback(() => {
      setIsMenuOpen(prev => !prev);
  }, [setIsMenuOpen]);

  const handleMenuOptionClick = useCallback((type) => {
      if (isTyping) return;
      setIsMenuOpen(false);
      if (type === "image" && imageInputRef.current) {
          imageInputRef.current.click();
      } else if (type === "file" && fileInputRef.current) {
          fileInputRef.current.click();
      }
  }, [isTyping, setIsMenuOpen]);

  // THÊM: Xử lý paste ảnh từ clipboard
  const handlePaste = useCallback((e) => {
      if (isTyping) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
          const item = items[i];
          
          if (item.type.indexOf('image') !== -1) {
              e.preventDefault();
              
              const file = item.getAsFile();
              if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                      alert && alert({ text: "Kích thước ảnh tối đa là 5MB.", type: "error" });
                      return;
                  }
                  
                  handleFileSelect(file);
              }
              break;
          }
      }
  }, [isTyping, handleFileSelect]);

  // THÊM: Event listener cho paste
  useEffect(() => {
      const inputElement = inputRef.current;
      if (!inputElement) return;

      inputElement.addEventListener('paste', handlePaste);
      
      return () => {
          if (inputElement) {
              inputElement.removeEventListener('paste', handlePaste);
          }
      };
  }, [handlePaste]);

  return (
    <div className={`w-full backdrop-blur-md p-4 sm:p-6 border-t border-gray-700 flex-shrink-0 ${isCentered ? "border-none" : ""}`}>
        <div className="max-w-4xl mx-auto">
            {alert && (
                <div className={`mb-3 p-3 text-sm rounded-md ${alert.type === "error" ? "bg-red-900/60 text-red-300 border border-red-700" : "bg-sky-900/60 text-sky-200 border border-sky-700"}`}>
                    {alert.text}
                </div>
            )}

            {previewUrl && (
                <div className="mb-3 flex items-center gap-3">
                    <img src={previewUrl} alt="preview" className="w-28 h-28 object-cover rounded-md border border-gray-700" />
                    <div className="flex-1 text-sm text-gray-300">
                        <div className="font-medium">{selectedFile?.name}</div>
                        <div className="text-xs text-gray-400">{Math.round((selectedFile?.size || 0) / 1024)} KB</div>
                    </div>
                    <button onClick={handleCancel} className="text-sm bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700">Hủy</button>
                </div>
            )}

            <div ref={dropRef} className={`mb-3 rounded p-2 ${isCentered ? "" : "border border-dashed border-gray-600"}`}>
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">

                    {!isCentered && (
                        <div className="relative flex-shrink-0">
                            <button
                                type="button"
                                onClick={toggleMenu}
                                disabled={isTyping}
                                className={`p-2 rounded-full text-white transition disabled:opacity-50
                                    ${isMenuOpen ? "bg-indigo-600 rotate-45" : "bg-gray-700 hover:bg-gray-600"}
                                `}
                            >
                                <PlusCircle size={20} className="transition-transform duration-300" />
                            </button>

                            <UploadMenu
                                isMenuOpen={isMenuOpen}
                                handleMenuOptionClick={handleMenuOptionClick}
                            />

                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isTyping}
                                onChange={(e) => {
                                    !isTyping && handleFileSelect(e.target.files?.[0]);
                                    if (e.target.files?.length) setIsMenuOpen(false);
                                }}
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf, text/plain, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, .csv, .json, .xml, .html, .css, .js, .ts, .jsx, .tsx"
                                className="hidden"
                                disabled={isTyping}
                                onChange={(e) => {
                                    !isTyping && handleFileSelect(e.target.files?.[0]);
                                    if (e.target.files?.length) setIsMenuOpen(false);
                                }}
                            />
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={isTyping ? "AI đang trả lời..." : (isCentered ? "Hỏi HyperX bất kỳ điều gì (Ctrl+V để paste ảnh)" : "Nhập câu hỏi hoặc paste ảnh (Ctrl+V)...")}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isTyping}
                        className={`w-full bg-gray-800 border border-gray-600 rounded-full py-3 text-white shadow-2xl focus:ring-pink-500 focus:border-pink-500 transition placeholder-gray-400 disabled:opacity-70 disabled:cursor-not-allowed ${isCentered ? "pl-5 pr-16" : "pl-5 pr-16"}`}
                    />

                    {isTyping ? (
                        <button
                            type="button"
                            onClick={handleStop}
                            className="absolute right-2 p-3 text-white rounded-full transition shadow-lg"
                            style={{
                                background: "linear-gradient(to right, #9089fc, #ff80b5)",
                                boxShadow: "0 4px 15px rgba(255, 128, 181, 0.4)",
                            }}
                        >
                            <Pause size={20} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!input || input.trim() === "" && !selectedFile}
                            className="absolute right-2 p-3 text-white rounded-full transition shadow-lg disabled:bg-gray-600 disabled:opacity-50"
                            style={{
                                background: "linear-gradient(to right, #9089fc, #ff80b5)",
                                boxShadow: "0 4px 15px rgba(255, 128, 181, 0.4)",
                            }}
                        >
                            <Send size={20} />
                        </button>
                    )}
                </form>
            </div>

        </div>
    </div>
  );
});

// -------------------- MAIN --------------------
export default function ChatbotAIPage({ user }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [abortCtrl, setAbortCtrl] = useState(null);
  const simIntervalRef = useRef(null);
  const isTypingRef = useRef(false);

  const msgContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (isMenuOpen && !event.target.closest('.input-area-wrapper')) {
            setIsMenuOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase.from("profiles").select("id, full_name, avatar_url, email").eq("id", user.id).single();
        if (error) setUserProfile(user);
        else setUserProfile({ ...user, full_name: data.full_name || user.full_name, avatar_url: data.avatar_url || user.avatar_url, email: data.email || user.email });
      } else setUserProfile(null);
    };
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (!isChatStarted) return;
    const el = msgContainerRef.current;
    if (!el) return;
    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (isBottom) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isChatStarted]);

  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const highlight = () => dropArea.classList.add("bg-gray-800/40", "border-blue-500");
    const unhighlight = () => dropArea.classList.remove("bg-gray-800/40", "border-blue-500");

    const handleDrop = (e) => {
      preventDefaults(e);
      if (isTypingRef.current) return;
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
      unhighlight();
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => dropArea.addEventListener(evt, preventDefaults));
    ["dragenter", "dragover"].forEach((evt) => dropArea.addEventListener(evt, highlight));
    ["dragleave", "drop"].forEach((evt) => dropArea.addEventListener(evt, unhighlight));
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      try {
        ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => dropArea.removeEventListener(evt, preventDefaults));
        ["dragenter", "dragover"].forEach((evt) => dropArea.removeEventListener(evt, highlight));
        ["dragleave", "drop"].forEach((evt) => dropArea.removeEventListener(evt, unhighlight));
        dropArea.removeEventListener("drop", handleDrop);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const showAlert = (text, type = "info", ms = 4000) => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), ms);
  };

  const handleCancelFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert("Kích thước tệp tối đa là 5MB.", "error", 5000);
      return;
    }

    setSelectedFile(file);
    try {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
      } else {
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Preview error:", err);
      setPreviewUrl(null);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (abortCtrl) {
      try {
        abortCtrl.abort();
      } catch (e) {
        console.warn("Abort failed:", e);
      }
    }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setIsTyping(false);
    setAbortCtrl(null);
    setMessages((prev) => prev.map((m) => (m.isPlaceholder ? { ...m, isPlaceholder: false, isThinking: false } : m)));
    showAlert("Đã dừng yêu cầu.", "info", 3000);
  }, [abortCtrl]);

  const callGeminiApi = useCallback(async (userPrompt, chatHistory = [], imageFile = null, onChunk = null) => {
    setAlert(null);
    if (!apiKey) {
      const authError = "Thiếu VITE_GEMINI_API_KEY trong file .env";
      setAlert({ text: authError, type: "error" });
      return { responseText: authError, sources: [] };
    }

    const userContentParts = [{ text: userPrompt }];

    if (imageFile) {
      try {
        const base64 = await convertToBase64(imageFile);
        const pure = base64.split(",")[1];
        userContentParts.push({
          inline_data: {
            mime_type: imageFile.type,
            data: pure,
          },
        });
      } catch (err) {
        console.error("Image conversion failed:", err);
      }
    }

    const systemInstructionContent = {
        role: "system",
        parts: [{ text: systemInstruction }],
    };

    const payload = {
      contents: [
        ...chatHistory,
        {
          role: "user",
          parts: userContentParts,
        },
      ],
      systemInstruction: systemInstructionContent,
    };

    let accumulated = "";
    let sources = [];
    const controller = new AbortController();
    setAbortCtrl(controller);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = await response.json();

      if (!response.ok) {
        const errMsg = result.error?.message || "Lỗi API không xác định";
        setAlert({ text: "Lỗi AI: " + errMsg, type: "error" });
        throw new Error(errMsg);
      }

      const candidate = result.candidates?.[0] || null;
      if (candidate) {
        accumulated = candidate.content?.parts?.[0]?.text || "";
        const grounding = candidate.groundingMetadata?.groundingAttributions || [];
        sources = grounding.map((g) => ({ uri: g.web?.uri, title: g.web?.title })).filter((x) => x.uri && x.title);
      }

      if (onChunk && accumulated) {
        const revealSpeed = 18;
        let i = 0;
        await new Promise((resolve) => {
          simIntervalRef.current = setInterval(() => {
            i++;
            onChunk(accumulated.slice(0, i));
            if (i >= accumulated.length) {
              clearInterval(simIntervalRef.current);
              simIntervalRef.current = null;
              resolve();
            }
          }, revealSpeed);
        });
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return { responseText: accumulated, sources };
      }
      console.error("Gemini API Error:", err);
      setAlert({ text: "Lỗi AI: " + (err.message || "Không thể kết nối"), type: "error" });
      return { responseText: accumulated || "Đã xảy ra lỗi khi xử lý yêu cầu.", sources };
    } finally {
      setAbortCtrl(null);
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    }

    return { responseText: accumulated, sources };
  }, [setAlert, setAbortCtrl]);

  const handleSendMessage = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // FIX: Kiểm tra an toàn cho input
    const prompt = (input || "").trim();
    if (!prompt && !selectedFile) return;
    if (isTyping) return;

    setIsMenuOpen(false);

    const now = Date.now();

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    const fileToSend = selectedFile;
    const urlToShow = previewUrl;

    setInput("");
    setSelectedFile(null);
    setPreviewUrl(null);

    setIsTyping(true);
    setAlert(null);

    const userMessageContent = prompt || (fileToSend ? `[Phân tích tệp: ${fileToSend.name}]` : "");

    const userMsg = {
      id: now,
      role: "user",
      content: userMessageContent,
      imageUrl: urlToShow || null,
    };

    const botPlaceholderId = now + 1;
    const botPlaceholder = { id: botPlaceholderId, role: "assistant", content: "", isPlaceholder: true, isThinking: true, sources: [] };

    setMessages((prev) => {
      return [...prev, userMsg, botPlaceholder];
    });

    const chatHistory = messages
        .filter(m => !m.isPlaceholder)
        .slice(-MAX_HISTORY_TURNS * 2)
        .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || "" }]
        }));

    const onChunk = (acc) => {
      setMessages((prev) =>
        prev.map((m) => {
            if (m.id === botPlaceholderId) {
                return { ...m, content: acc, isThinking: false };
            }
            return m;
        })
      );

      const el = msgContainerRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    };

    try {
      const { responseText, sources } = await callGeminiApi(prompt || "", chatHistory, fileToSend, onChunk);

      setMessages((prev) => prev.map((m) => (m.id === botPlaceholderId ? { ...m, content: responseText, sources, isPlaceholder: false, isThinking: false } : m)));
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => prev.map((m) => (m.id === botPlaceholderId ? { ...m, content: "Không nhận được phản hồi từ AI.", isPlaceholder: false, isThinking: false } : m)));
    } finally {
      setIsTyping(false);
    }
  }, [input, selectedFile, isTyping, isChatStarted, previewUrl, messages, callGeminiApi, setIsMenuOpen]);

  return (
    <div className="relative isolate bg-gray-900 pt-16 overflow-hidden min-h-screen">
      <div className="absolute min-h-screen inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
        <div style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[1155px] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
      </div>

      {isChatStarted ? (
        <div className="w-full max-w-5xl mx-auto flex flex-col h-[630px] relative z-10 pt-8">
          <div ref={msgContainerRef} className="flex-1 overflow-y-auto px-6 sm:px-12 pt-4 pb-6 custom-scrollbar">
            {messages.map((msg, idx) => (
              <Message key={msg.id} msg={msg} isLast={idx === messages.length - 1} currentUser={userProfile} isTyping={isTyping} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area-wrapper">
            <MemoizedInputArea
              isCentered={false}
              isTyping={isTyping}
              alert={alert}
              previewUrl={previewUrl}
              selectedFile={selectedFile}
              input={input}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
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
        <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-64px)] justify-center items-center relative z-10 px-4">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
              Xin chào, {userProfile?.full_name || "bạn"}!
            </h1>
            <p className="text-gray-400 text-lg">
            </p>
          </div>
          <div className="max-w-2xl w-full input-area-wrapper">
            <MemoizedInputArea
              isCentered={true}
              isTyping={isTyping}
              alert={alert}
              previewUrl={previewUrl}
              selectedFile={selectedFile}
              input={input}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
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