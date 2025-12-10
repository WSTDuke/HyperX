import { useState, useMemo } from "react";
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  CreditCard, 
  User, 
  Cpu, 
  FileText 
} from "lucide-react";

const HelpAndSupport = () => {
    const [activeTab, setActiveTab] = useState("orders");
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    // Dữ liệu mẫu cho FAQ
    const categories = [
        { id: "orders", label: "Orders & Shipping", icon: <Package size={18} /> },
        { id: "billing", label: "Billing & Refunds", icon: <CreditCard size={18} /> },
        { id: "account", label: "Account Settings", icon: <User size={18} /> },
        { id: "tech", label: "Technical Issues", icon: <Cpu size={18} /> },
    ];

    const faqData = {
        orders: [
            { question: "How do I track my order?", answer: "You can track your order by going to the 'Orders' tab in your profile. Click on the specific order to see real-time shipping updates." },
            { question: "Can I change my shipping address?", answer: "Shipping addresses can only be changed within 1 hour of placing the order. Please contact support immediately via Live Chat." },
            { question: "What is the estimated delivery time?", answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days depending on your location." },
        ],
        billing: [
            { question: "How do I get a refund?", answer: "Refunds are processed within 5-7 business days after we receive your returned item. Navigate to 'My Orders' > 'Return Item' to start the process." },
            { question: "Where can I find my invoice?", answer: "Invoices are sent to your email immediately after purchase. You can also download them from your Order History." },
        ],
        account: [
            { question: "How do I reset my password?", answer: "Go to Settings > Security and click on 'Change Password'. If you cannot login, use the 'Forgot Password' link on the login page." },
            { question: "Can I delete my account?", answer: "Yes, you can request account deletion in the 'General' settings tab. Please note this action is irreversible." },
        ],
        tech: [
            { question: " The app is crashing on my phone.", answer: "Please ensure you have the latest version installed. Try clearing the cache or reinstalling the application." },
            { question: "I'm not receiving email notifications.", answer: "Check your spam folder. Also, ensure that email notifications are enabled in your Account Settings." },
        ]
    };

    // Logic lọc dữ liệu khi tìm kiếm hoặc chuyển tab
    const filteredFaqs = useMemo(() => {
        if (searchQuery.trim() !== "") {
            // Nếu có tìm kiếm, gộp tất cả category và lọc
            const allFaqs = Object.values(faqData).flat();
            return allFaqs.filter(item => 
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        // Nếu không tìm kiếm, trả về data của tab hiện tại
        return faqData[activeTab] || [];
    }, [searchQuery, activeTab]);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-[#05050A] min-h-screen text-gray-300 font-sans pt-24 px-4 pb-12 relative isolate overflow-hidden">
            
            {/* --- Background Effects (Giống file mẫu) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            <div className="fixed top-20 right-0 -z-10 w-[30rem] h-[30rem] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">How can we help you?</h1>
                    <div className="relative max-w-xl mx-auto mt-6">
                        <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search for answers (e.g., 'refund', 'password')..." 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setOpenFaqIndex(null); }}
                            className="w-full bg-[#0B0D14]/80 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-xl backdrop-blur-md"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row bg-[#0B0D14]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
                    
                    {/* SIDEBAR NAVIGATION */}
                    <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/5 lg:bg-transparent p-6">
                        <h2 className="text-lg font-bold text-white mb-6 px-2 flex items-center gap-2">
                            <HelpCircle className="text-indigo-500" size={20}/> Support Center
                        </h2>
                        <nav className="space-y-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveTab(cat.id); setSearchQuery(""); setOpenFaqIndex(null); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                                        ${activeTab === cat.id && !searchQuery
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </nav>
                        
                        {/* Direct Contact Box in Sidebar */}
                        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                            <h3 className="text-white font-semibold mb-2 text-sm">Can't find an answer?</h3>
                            <p className="text-xs text-gray-400 mb-4">Our team is available 24/7 to help you.</p>
                            <button className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/10">
                                Contact Support
                            </button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar relative">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">
                                        {searchQuery ? `Results for "${searchQuery}"` : categories.find(c => c.id === activeTab)?.label}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {searchQuery 
                                            ? `Found ${filteredFaqs.length} articles` 
                                            : "Frequently asked questions in this category."}
                                    </p>
                                </div>
                                {!searchQuery && <FileText className="text-indigo-500/50 mb-1" size={32} />}
                            </div>

                            {/* FAQ LIST */}
                            <div className="space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq, index) => (
                                        <div 
                                            key={index} 
                                            className={`group rounded-xl border transition-all duration-300 overflow-hidden
                                                ${openFaqIndex === index 
                                                    ? "bg-white/[0.03] border-indigo-500/30 shadow-lg" 
                                                    : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                                                }`}
                                        >
                                            <button 
                                                onClick={() => toggleFaq(index)}
                                                className="w-full flex items-center justify-between p-5 text-left"
                                            >
                                                <span className={`font-medium transition-colors ${openFaqIndex === index ? "text-indigo-400" : "text-gray-300 group-hover:text-white"}`}>
                                                    {faq.question}
                                                </span>
                                                {openFaqIndex === index ? (
                                                    <ChevronUp className="text-indigo-500 transition-transform" size={18} />
                                                ) : (
                                                    <ChevronDown className="text-gray-500 group-hover:text-white transition-transform" size={18} />
                                                )}
                                            </button>
                                            
                                            <div 
                                                className={`transition-all duration-300 ease-in-out overflow-hidden
                                                ${openFaqIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                                            >
                                                <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                                            <Search size={24} />
                                        </div>
                                        <h3 className="text-white font-medium mb-1">No results found</h3>
                                        <p className="text-gray-500 text-sm">Try using different keywords or browse the categories.</p>
                                    </div>
                                )}
                            </div>

                            {/* STILL NEED HELP SECTION */}
                            <div className="mt-16 pt-8 border-t border-white/10">
                                <h4 className="text-white font-semibold mb-6">Still need help?</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                <MessageCircle size={20} />
                                            </div>
                                            <div>
                                                <h5 className="text-white font-medium text-sm">Live Chat</h5>
                                                <p className="text-gray-500 text-xs mt-0.5">Wait time: ~2 mins</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <h5 className="text-white font-medium text-sm">Email Support</h5>
                                                <p className="text-gray-500 text-xs mt-0.5">Response within 24h</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HelpAndSupport;