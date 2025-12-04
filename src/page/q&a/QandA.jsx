import React, { useState, useEffect, useRef } from "react";
import { Send, Search, MessageSquare, Loader2, User, Bot, Zap, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// --- Configuration (Sử dụng model Gemini và Google Search) ---
// CHÚ Ý: Mặc dù bạn để trống, Canvas sẽ cố gắng tự động cung cấp khóa API.
// Nếu lỗi 403 vẫn xảy ra, khóa API của bạn không hoạt động hoặc bị thiếu.
const apiKey = ""; 
const modelName = "gemini-2.5-flash-preview-09-2025";
const apiUrlBase = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

// Xây dựng URL API hoàn chỉnh. Dùng apiUrlBase trần nếu apiKey rỗng, để Canvas tự thêm key.
const apiUrl = `${apiUrlBase}${apiKey ? `?key=${apiKey}` : ''}`; 

// --- Định nghĩa cấu trúc tin nhắn ---
const initialMessages = [
    { 
        id: Date.now(),
        role: "assistant", 
        content: "Xin chào! Tôi là trợ lý AI của HyperX. Tôi có thể giúp bạn tìm kiếm thông tin, giải đáp thắc mắc về công nghệ, hoặc hướng dẫn sử dụng nền tảng này. Hãy hỏi tôi bất cứ điều gì!",
        sources: null 
    }
];

export default function QnAPage({ user }) {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);

    // Cuộn xuống cuối tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Hàm gọi API Gemini
    const callGeminiApi = async (userPrompt, chatHistory) => {
        setError(null);
        
        // System instruction: Xác định persona cho AI
        const systemPrompt = "You are HyperX, a helpful and knowledgeable AI assistant. You answer questions concisely, professionally, and in Vietnamese. If the answer requires up-to-date knowledge, use the provided Google Search results to ground your response.";

        // Xây dựng payload API
        const payload = {
            contents: chatHistory,
            tools: [{ "google_search": {} }], // Kích hoạt Google Search grounding
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        let responseText = "";
        let sources = [];
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                
                // BẮT LỖI 403 (FORBIDDEN) HOẶC XÁC THỰC RÕ RÀNG HƠN
                if (response.status === 403 || response.status === 401) {
                    throw new Error("Lỗi xác thực (403/401): Vui lòng kiểm tra API Key. Có thể bị thiếu, không hợp lệ, hoặc không có quyền truy cập Gemini API.");
                }

                throw new Error(errorBody.error?.message || `API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                responseText = candidate.content.parts[0].text;
                
                // Trích xuất nguồn (citations) nếu có
                const groundingMetadata = candidate.groundingMetadata;
                if (groundingMetadata && groundingMetadata.groundingAttributions) {
                    sources = groundingMetadata.groundingAttributions
                        .map(attribution => ({
                            uri: attribution.web?.uri,
                            title: attribution.web?.title,
                        }))
                        .filter(source => source.uri && source.title);
                }
            } else {
                responseText = "Xin lỗi, tôi không thể tạo ra phản hồi cho truy vấn này.";
            }

        } catch (err) {
            console.error("Gemini API Error:", err);
            // Cập nhật error state để hiển thị trên UI
            setError("Lỗi kết nối AI: " + err.message); 
            responseText = "Đã xảy ra lỗi hệ thống khi xử lý yêu cầu của bạn.";
        }
        
        return { responseText, sources };
    };

    // Hàm xử lý gửi tin nhắn
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const prompt = input.trim();
        if (!prompt || isTyping) return;

        setInput("");
        setIsTyping(true);
        setError(null);

        // 1. Thêm tin nhắn của người dùng vào state
        const userMessage = { id: Date.now(), role: "user", content: prompt };
        
        // Thêm một tin nhắn placeholder cho AI (để hiển thị loading)
        const botPlaceholderId = Date.now() + 1;
        const botPlaceholder = { id: botPlaceholderId, role: "assistant", content: "", isPlaceholder: true };

        setMessages(prev => [...prev, userMessage, botPlaceholder]);

        // 2. Xây dựng lịch sử chat cho API
        // Giới hạn chỉ gửi 5 tin nhắn cuối cùng (user + bot) + tin nhắn hiện tại
        const historyToSend = messages.slice(-5).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));
        
        historyToSend.push({ role: 'user', parts: [{ text: prompt }] });


        // 3. Gọi API
        const { responseText, sources } = await callGeminiApi(prompt, historyToSend);

        // 4. Cập nhật tin nhắn placeholder bằng phản hồi thật
        setMessages(prev => prev.map(msg => 
            msg.id === botPlaceholderId
            ? { ...msg, content: responseText, sources: sources, isPlaceholder: false }
            : msg
        ));
        
        setIsTyping(false);
    };

    // Component để hiển thị tin nhắn
    const Message = ({ msg, isLast, isTyping }) => {
        const isUser = msg.role === "user";
        const icon = isUser ? <User size={18} /> : <Bot size={18} />;
        const color = isUser ? "bg-indigo-600" : "bg-gray-700";
        const alignment = isUser ? "self-end" : "self-start";

        return (
            <div className={`flex flex-col max-w-3xl w-full ${alignment} mb-4`}>
                <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar/Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-full ${color} text-white`}>
                        {icon}
                    </div>

                    {/* Content Bubble */}
                    <div className={`p-4 rounded-xl shadow-lg transition-all duration-300
                        ${isUser ? 'bg-indigo-600 rounded-br-none text-white' : 'bg-gray-800 rounded-tl-none text-gray-200 border border-gray-700'}`}
                    >
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                            {msg.content}
                            {/* Hiển thị hiệu ứng typing cho tin nhắn cuối cùng */}
                            {isLast && msg.isPlaceholder && isTyping && (
                                <span className="inline-block w-2 h-2 ml-2 bg-white rounded-full animate-pulse"></span>
                            )}
                        </p>

                        {/* Nguồn Grounding */}
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-4 pt-2 border-t border-gray-600">
                                <span className="text-xs font-semibold text-gray-400">Sources:</span>
                                <ul className="mt-1 space-y-1">
                                    {msg.sources.slice(0, 3).map((source, index) => (
                                        <li key={index} className="flex items-center gap-1">
                                            <ExternalLink size={10} className="text-gray-500 flex-shrink-0" />
                                            <a 
                                                href={source.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-xs text-indigo-400 hover:text-indigo-300 truncate transition-colors"
                                                title={source.title}
                                            >
                                                {source.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        // Đặt toàn bộ khung chat trong h-screen và dùng flex-col
        <div className="relative isolate bg-gray-900 pt-12 overflow-hidden min-h-screen">
            {/* Background Blur Effect */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
                <div style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[1155px] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
            </div>

            {/* Container chính: Đảm bảo h-screen và dùng flex-col */}
            <div className="w-full max-w-5xl mx-auto flex flex-col h-[100dvh] relative z-10"> 
                
                {/* Header Chatbot (flex-shrink-0) */}
                <div className="pt-10 px-6 sm:px-12 pb-4 flex-shrink-0">
                    <div className="pb-4 border-b border-gray-700">
                        <div className="flex items-center gap-3 text-white mb-4">
                            <Zap size={32} className="text-pink-500" />
                            <h2 className="text-3xl font-bold">HyperX AI Assistant</h2>
                        </div>
                        <p className="text-gray-400 mb-4">Ask any question to get instant, grounded answers powered by Gemini.</p>
                    </div>
                </div>

                {/* Chat Messages Area - Vùng cuộn (flex-1) */}
                {/* Loại bỏ padding bottom lớn, chỉ dùng padding tiêu chuẩn */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-12 pt-4 pb-6 custom-scrollbar"> 
                    {messages.map((msg, index) => (
                        <Message 
                            key={msg.id} 
                            msg={msg} 
                            isLast={index === messages.length - 1}
                            isTyping={isTyping}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Đặt ở dưới (flex-shrink-0) */}
                {/* Loại bỏ fixed và thêm padding/margin để nó nằm trong luồng Flex */}
                <div className="w-full bg-gray-900/90 backdrop-blur-md p-4 sm:p-6 border-t border-gray-700 shadow-xl flex-shrink-0">
                    <div className="max-w-4xl mx-auto">
                        {error && (
                            <div className="mb-3 p-3 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-lg">
                                Lỗi: {error}
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input 
                                type="text" 
                                placeholder={isTyping ? "AI đang trả lời..." : "Nhập câu hỏi của bạn..."} 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                disabled={isTyping}
                                className="w-full bg-gray-800 border border-gray-600 rounded-full pl-5 pr-16 py-3 text-white focus:ring-pink-500 focus:border-pink-500 transition placeholder-gray-400 disabled:opacity-70 disabled:cursor-not-allowed" 
                            />
                            <button 
                                type="submit" 
                                disabled={isTyping || input.trim() === ""}
                                className="absolute right-2 p-3 bg-pink-600 text-white rounded-full hover:bg-pink-500 transition shadow-lg shadow-pink-900/40 disabled:bg-gray-600 disabled:opacity-50"
                            >
                                {isTyping ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}