import React, { useRef, useCallback, useEffect } from "react";
import { Send, Pause, Image as ImageIcon, FileText, X } from "lucide-react";

// Upload menu component
const UploadMenu = React.memo(({ isMenuOpen, handleMenuOptionClick }) => {
    if (!isMenuOpen) return null;

    return (
        <div className="absolute bottom-full left-0 mb-3 w-48 rounded-xl shadow-2xl bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button 
                onClick={() => handleMenuOptionClick("image")} 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors"
            >
                <div className="p-1.5 bg-cyan-500/20 rounded-lg mr-3 text-cyan-400">
                    <ImageIcon size={16} />
                </div>
                Upload Image
            </button>
            <button 
                onClick={() => handleMenuOptionClick("file")} 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors cursor-not-allowed opacity-50"
                disabled
            >
                <div className="p-1.5 bg-blue-500/20 rounded-lg mr-3 text-blue-400">
                    <FileText size={16} />
                </div>
                Document (Soon)
            </button>
        </div>
    );
});

// Main Input Component
export const ChatInput = React.memo(({
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
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleCancel = useCallback(() => {
        handleCancelFile();
        if (imageInputRef.current) imageInputRef.current.value = null;
        if (fileInputRef.current) fileInputRef.current.value = null;
    }, [handleCancelFile]);

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [setIsMenuOpen]);

    const handleMenuOptionClick = useCallback((type) => {
        if (isTyping) return;
        setIsMenuOpen(false);
        if (type === "image" && imageInputRef.current) imageInputRef.current.click();
        else if (type === "file" && fileInputRef.current) fileInputRef.current.click();
    }, [isTyping, setIsMenuOpen]);

    return (
        <div className={`w-full transition-all duration-500 ${isCentered ? "" : "backdrop-blur-xl bg-[#05050A]/80 border-t border-white/5 p-4 sm:p-6"}`}>
            <div className={`mx-auto ${isCentered ? "max-w-2xl" : "max-w-4xl"}`}>
                
                {/* Alert Notification */}
                {alert && (
                    <div className={`mb-4 p-3 text-sm rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 ${alert.type === "error" ? "bg-red-500/10 text-red-300 border border-red-500/20" : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"}`}>
                        <span>{alert.text}</span>
                    </div>
                )}

                {/* File Preview Area */}
                {(previewUrl || selectedFile) && (
                    <div className="mb-4 inline-flex items-center gap-3 p-2 pr-4 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in zoom-in duration-200 shadow-lg">
                        {previewUrl ? (
                            <img src={previewUrl} alt="preview" className="w-12 h-12 object-cover rounded-xl border border-white/10" />
                        ) : (
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                <FileText size={24} />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate max-w-[200px]">{selectedFile?.name}</div>
                            <div className="text-xs text-gray-400">{selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB</div>
                        </div>
                        <button onClick={handleCancel} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Main Input Box */}
                <div
                    ref={dropRef}
                    // STYLE: Input Container Styles (Cyan Focus)
                    className={`relative group rounded-[2rem] transition-all duration-300
                        ${isCentered 
                            ? "bg-[#0B0D14] border border-white/10 shadow-2xl hover:border-cyan-500/30 hover:shadow-cyan-500/10 p-2" 
                            : "bg-[#0B0D14] border border-white/10 p-2"
                        }
                        focus-within:border-cyan-500/50 focus-within:shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)]
                    `}
                >
                    <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">

                        {/* Menu Toggle Button */}
                        <div className="relative flex-shrink-0 pb-1 pl-1">
                            <button
                                type="button"
                                onClick={toggleMenu}
                                disabled={isTyping}
                                className={`p-2.5 rounded-full transition-all duration-300 disabled:opacity-50
                                    ${isMenuOpen 
                                        ? "bg-cyan-500/20 text-cyan-400 rotate-45" 
                                        : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <PlusIcon size={20} />
                            </button>
                            <UploadMenu isMenuOpen={isMenuOpen} handleMenuOptionClick={handleMenuOptionClick} />

                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isTyping}
                                onChange={(e) => { !isTyping && handleFileSelect(e.target.files?.[0]); if (e.target.files?.length) setIsMenuOpen(false); }}
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                disabled={isTyping}
                                onChange={(e) => { !isTyping && handleFileSelect(e.target.files?.[0]); if (e.target.files?.length) setIsMenuOpen(false); }}
                            />
                        </div>

                        {/* Text Input */}
                        <textarea
                            ref={textareaRef}
                            placeholder={isTyping ? "AI is thinking..." : "Ask anything..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            disabled={isTyping}
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 px-2 py-3.5 text-base min-w-0 resize-none max-h-[200px] overflow-y-auto custom-scrollbar"
                            rows={1}
                            style={{ minHeight: '52px' }}
                        />

                        {/* Action Button (Send/Stop) */}
                        <div className="flex-shrink-0 pb-1 pr-1">
                            {isTyping ? (
                                <button 
                                    type="button" 
                                    onClick={handleStop} 
                                    className="p-3 rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 animate-pulse bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                                >
                                    <Pause size={20} fill="currentColor" />
                                </button>
                            ) : (
                                <button 
                                    type="submit" 
                                    disabled={input.trim() === "" && !selectedFile} 
                                    className="p-3 rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none" 
                                    // STYLE: Send Button Gradient (Cyan-Blue)
                                    style={{ background: "linear-gradient(135deg, #0891b2, #2563eb)", boxShadow: input.trim() || selectedFile ? "0 4px 15px rgba(8, 145, 178, 0.3)" : "none" }}
                                >
                                    <Send size={20} fill="currentColor" className={(!input.trim() && !selectedFile) ? "" : "ml-0.5"} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                
                {isCentered && (
                    <div className="mt-6 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 delay-100 duration-500">
                        {["Explain quantum physics", "Write a Python script", "Analyze this image"].map((suggestion, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setInput(suggestion)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

const PlusIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default ChatInput;