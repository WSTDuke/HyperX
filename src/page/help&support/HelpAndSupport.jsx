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

    const filteredFaqs = useMemo(() => {
        if (searchQuery.trim() !== "") {
            const allFaqs = Object.values(faqData).flat();
            return allFaqs.filter(item => 
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return faqData[activeTab] || [];
    }, [searchQuery, activeTab]);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-[#05050A] min-h-screen text-gray-300 font-sans pt-24 px-4 pb-12 relative isolate overflow-hidden">
            
            {/* --- Background Effects (Cyan/Blue) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            <div className="fixed top-20 right-0 -z-10 w-[40rem] h-[40rem] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                
                {/* Header Section */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">How can we help you?</h1>
                    <div className="relative max-w-xl mx-auto mt-8 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search for answers (e.g., 'refund', 'password')..." 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setOpenFaqIndex(null); }}
                            className="w-full bg-[#0B0D14]/80 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-xl backdrop-blur-md"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row bg-[#0B0D14]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
                    
                    {/* SIDEBAR NAVIGATION */}
                    <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02] lg:bg-transparent p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 px-2 flex items-center gap-2">
                                <HelpCircle className="text-cyan-500" size={16}/> Support Center
                            </h2>
                            <nav className="space-y-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setActiveTab(cat.id); setSearchQuery(""); setOpenFaqIndex(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden
                                            ${activeTab === cat.id && !searchQuery
                                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                                                : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                                            }`}
                                    >
                                        <span className={`transition-transform duration-300 ${activeTab === cat.id && !searchQuery ? "scale-110" : "group-hover:scale-110"}`}>
                                            {cat.icon}
                                        </span>
                                        {cat.label}
                                        {activeTab === cat.id && !searchQuery && (
                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-l-full"></div>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        {/* Direct Contact Box */}
                        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-cyan-500/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <MessageCircle size={40} />
                            </div>
                            <h3 className="text-white font-bold mb-1 text-sm relative z-10">Can't find an answer?</h3>
                            <p className="text-xs text-gray-400 mb-4 relative z-10 leading-relaxed">Our team is available 24/7 to assist you with any issues.</p>
                            <button className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-white/5 relative z-10">
                                Contact Support
                            </button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar relative">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                                        {searchQuery ? `Results for "${searchQuery}"` : categories.find(c => c.id === activeTab)?.label}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {searchQuery 
                                            ? `Found ${filteredFaqs.length} articles matching your query.` 
                                            : "Frequently asked questions in this category."}
                                    </p>
                                </div>
                                {!searchQuery && (
                                    <div className="hidden md:block p-3 bg-white/5 rounded-2xl text-cyan-500/50">
                                        <FileText size={32} />
                                    </div>
                                )}
                            </div>

                            {/* FAQ LIST */}
                            <div className="space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq, index) => (
                                        <div 
                                            key={index} 
                                            className={`group rounded-2xl border transition-all duration-300 overflow-hidden
                                                ${openFaqIndex === index 
                                                    ? "bg-white/[0.03] border-cyan-500/30 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)]" 
                                                    : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                                                }`}
                                        >
                                            <button 
                                                onClick={() => toggleFaq(index)}
                                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                            >
                                                <span className={`font-medium transition-colors text-base pr-4 ${openFaqIndex === index ? "text-cyan-400" : "text-gray-300 group-hover:text-white"}`}>
                                                    {faq.question}
                                                </span>
                                                <div className={`p-1 rounded-full transition-all duration-300 ${openFaqIndex === index ? "bg-cyan-500/10 rotate-180" : "bg-white/5 group-hover:bg-white/10"}`}>
                                                    <ChevronDown className={`transition-colors ${openFaqIndex === index ? "text-cyan-400" : "text-gray-500 group-hover:text-white"}`} size={18} />
                                                </div>
                                            </button>
                                            
                                            <div 
                                                className={`transition-all duration-300 ease-in-out overflow-hidden
                                                ${openFaqIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                                            >
                                                <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                                            <Search size={28} />
                                        </div>
                                        <h3 className="text-white font-medium mb-1">No results found</h3>
                                        <p className="text-gray-500 text-sm">Try using different keywords or browse the categories.</p>
                                    </div>
                                )}
                            </div>

                            {/* STILL NEED HELP SECTION */}
                            <div className="mt-16 pt-8 border-t border-white/10">
                                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Still need help?</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20">
                                                <MessageCircle size={22} />
                                            </div>
                                            <div>
                                                <h5 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">Live Chat</h5>
                                                <p className="text-gray-500 text-xs mt-1">Wait time: ~2 mins</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20">
                                                <Mail size={22} />
                                            </div>
                                            <div>
                                                <h5 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">Email Support</h5>
                                                <p className="text-gray-500 text-xs mt-1">Response within 24h</p>
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