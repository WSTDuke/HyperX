// ChatInput.jsx
import React, { useRef, useCallback } from "react";
import { Send, Pause, PlusCircle, Image as ImageIcon } from "lucide-react";

// Upload menu component
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
                Upload Tệp
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
        <div className={`w-full backdrop-blur-md p-4 sm:p-6 border-t border-gray-700 flex-shrink-0 ${isCentered ? "border-none" : ""}`}>
            <div className="max-w-4xl mx-auto">
                {/* Alert */}
                {alert && (
                    <div className={`mb-3 p-3 text-sm rounded-md ${alert.type === "error" ? "bg-red-900/60 text-red-300 border border-red-700" : "bg-sky-900/60 text-sky-200 border border-sky-700"}`}>
                        {alert.text}
                    </div>
                )}

                {/* Preview */}
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

                <div
  ref={dropRef}
  className={`mb-3 p-2 border border-gray-600 rounded-4xl ${isCentered ? "" : ""}`}
>
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">

                        {!isCentered && (
                            <div className="relative flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={toggleMenu}
                                    disabled={isTyping}
                                    className={`p-2 rounded-full text-white transition disabled:opacity-50
                                        ${isMenuOpen ? "bg-indigo-600 rotate-45" : "bg-gray-700 hover:bg-gray-600"}`}
                                >
                                    <PlusCircle size={20} className="transition-transform duration-300" />
                                </button>
                                <UploadMenu isMenuOpen={isMenuOpen} handleMenuOptionClick={handleMenuOptionClick} />

                                {/* Hidden inputs */}
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
                            type="text"
                            placeholder={isTyping ? "AI đang trả lời..." : (isCentered ? "Hỏi bất kỳ điều gì" : "Nhập câu hỏi của bạn hoặc kéo file vào ô này...")}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isTyping}
                            className={`w-full bg-gray-800 border border-gray-600 rounded-full py-3 text-white shadow-2xl focus:ring-pink-500 focus:border-pink-500 transition placeholder-gray-400 disabled:opacity-70 disabled:cursor-not-allowed ${isCentered ? "pl-5 pr-16" : "pl-5 pr-16"}`}
                        />

                        {isTyping ? (
                            <button type="button" onClick={handleStop} className="absolute right-2 p-3 text-white rounded-full transition shadow-lg" style={{ background: "linear-gradient(to right, #9089fc, #ff80b5)", boxShadow: "0 4px 15px rgba(255, 128, 181, 0.4)" }}>
                                <Pause size={20} />
                            </button>
                        ) : (
                            <button type="submit" disabled={input.trim() === "" && !selectedFile} className="absolute right-2 p-3 text-white rounded-full transition shadow-lg disabled:bg-gray-600 disabled:opacity-50" style={{ background: "linear-gradient(to right, #9089fc, #ff80b5)", boxShadow: "0 4px 15px rgba(255, 128, 181, 0.4)" }}>
                                <Send size={20} />
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
});

export default ChatInput;