import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Menu, X } from 'lucide-react';

// --- MOCK DATA (100% English Content) ---
const mockDocsContent = {
    // 1. Getting Started
    "intro": {
        title: "Introduction to the HyperX Ecosystem",
        content: `Welcome to HyperX! This platform is built to connect the creative community and provide essential tools for product development and sharing.
        \n\nHere you can find Products to buy or sell, engage in the Community to share knowledge, or consult this Documentation (Docs) to gain a deeper understanding of our core APIs and features.`,
        next: "api-overview"
    },
    // 2. API Overview
    "api-overview": {
        title: "API Overview: Supabase Integration",
        content: `Most core functionalities of HyperX, including user management, community posts, and product details, are built on top of Supabase.
        \n\nWe utilize:
        \n* **Authentication:** Managing user sign-up/sign-in and retrieving the current user (\`currentUser\`).
        \n* **Postgres Database:** Storing posts, products, profiles, and relational data (e.g., follows).
        \n* **Realtime:** Providing instantaneous updates for notifications and comments.
        \n\n[Code Example: Fetching Products]`,
        code: `const fetchProducts = async () => {\n  // Fetching a list of products\n  const { data, error } = await supabase\n    .from('products')\n    .select('id, name, price, image_url')\n    .order('created_at', { ascending: false });\n  if (error) console.error(error);\n  return data;\n};`,
        next: "community-posts"
    },
    // 3. Community Posts
    "community-posts": {
        title: "Community: Creating, Editing, and Deleting Posts",
        content: `Community posts are stored in the 'community_posts' table.
        \n\n**Creating a Post:** Use the \`insert\` function with the post's \`title\`, \`content\`, and the \`user_id\` of the current user.
        \n**Editing/Deleting:** Requires the user to be the owner of the post. This is enforced via Row Level Security (RLS) policies on the 'community_posts' table, typically checking if \`auth.uid() = user_id\`.`,
        next: "product-upload"
    },
    // 4. Product Upload
    "product-upload": {
        title: "Product Upload & Asset Storage Management",
        content: `Your product metadata is stored in the 'products' table, while digital assets (like cover images) are stored in Supabase Storage.
        \n\n**Upload Process Summary:** \n1. Upload the main image file (Cover Image) to the dedicated Storage Bucket (e.g., 'product-images').
        \n2. Retrieve the Public URL for the uploaded image.
        \n3. Insert the product metadata (including the Public URL string) into the 'products' table.`,
        next: "profile-and-follows"
    },
    // 5. Profile & Follows
    "profile-and-follows": {
        title: "Profile, Stats, and Follows Logic Optimization",
        content: `Detailed user information is maintained in the 'profiles' table.
        \n\nFollow/Unfollow functionality uses an intermediate 'follows' table (\`follower_id\`, \`following_id\`).
        \n\nTo optimize profile loading speed, multiple necessary API calls (post count, follower count, product list, and follow status check) are executed concurrently using JavaScript's \`Promise.all()\`. This ensures the total loading time is determined by the slowest query, not the sum of all queries.`,
        next: null // End of docs
    }
};

const navigationStructure = [
    { 
        id: 'getting-started', 
        title: 'Getting Started', 
        children: [
            { id: 'intro', title: '1. Introduction' },
            { id: 'api-overview', title: '2. API Overview' },
        ]
    },
    { 
        id: 'features', 
        title: 'Core Features', 
        children: [
            { id: 'community-posts', title: '3. Community Posts' },
            { id: 'product-upload', title: '4. Product Upload' },
            { id: 'profile-and-follows', title: '5. Profile & Follows' },
        ]
    },
];

// --- SUB-COMPONENT: DocsSidebar ---
const DocsSidebar = ({ activeDoc, setActiveDoc, isMobileOpen, setIsMobileOpen }) => {
    return (
        <aside className={`
            fixed inset-y-0 pt-4 left-0 z-40 md:relative md:translate-x-0 transition-transform duration-300
            w-64 border-r border-gray-700 bg-[#1e293b]/80 md:bg-transparent md:border-r-0 flex-shrink-0 
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            md:block md:w-64 overflow-y-auto custom-scrollbar
        `}>
            <div className="p-6">
                <div className="flex items-center justify-between md:justify-start gap-2 mb-8 text-indigo-400">
                    <BookOpen size={24} />
                    <h2 className="font-bold text-xl text-white">HyperX Docs</h2>
                    <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="space-y-6">
                    {navigationStructure.map((section) => (
                        <div key={section.id}>
                            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 border-b border-gray-700 pb-1">
                                {section.title}
                            </h3>
                            <ul className="space-y-1 mt-2">
                                {section.children.map((item) => (
                                    <li 
                                        key={item.id}
                                        onClick={() => {
                                            setActiveDoc(item.id);
                                            setIsMobileOpen(false); // Close menu on select (mobile)
                                        }}
                                        className={`
                                            px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium
                                            ${activeDoc === item.id 
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                                                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                                            }
                                        `}
                                    >
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            {/* Mobile Overlay */}
            {isMobileOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileSidebarOpen(false)}></div>}
        </aside>
    );
};


// --- MAIN COMPONENT: DocsPage ---
const DocsPage = () => {
    const [activeDoc, setActiveDoc] = useState('intro');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContent, setFilteredContent] = useState(mockDocsContent['intro']);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
    // Load content when activeDoc changes
    useEffect(() => {
        const doc = mockDocsContent[activeDoc] || mockDocsContent['intro'];
        setFilteredContent(doc);
    }, [activeDoc]);

     const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();

    if (query === '') {
        setActiveDoc('intro');
        return;
    }

    const keys = Object.keys(mockDocsContent);

    const searchResults = keys.filter(key => {
        const doc = mockDocsContent[key];
        return doc.title.toLowerCase().includes(query);
    });

    if (searchResults.length > 0) {
        setActiveDoc(searchResults[0]);
        setSearchTerm('');
    } else {
        setFilteredContent({
            title: "No Documentation Found",
            content: `We could not find any document matching "${searchTerm}".`,
            isNotFound: true
        });
    }
};


    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans pt-16">
            <div className="flex h-full max-w-7xl mx-auto md:h-screen md:max-h-[calc(100vh-60px)]">
                
                {/* --- SIDEBAR (Desktop & Mobile) --- */}
                <DocsSidebar 
                    activeDoc={activeDoc} 
                    setActiveDoc={setActiveDoc} 
                    isMobileOpen={isMobileSidebarOpen}
                    setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                />

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 px-4 md:px-10 py-8 md:pt-10 overflow-y-auto custom-scrollbar">
                    
                    {/* Header/Search Bar (Mobile & Desktop) */}
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700/50">
                        
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition">
                                <Menu size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSearch} className="relative flex-1 md:flex-none md:w-80 ml-4 md:ml-0">
                            <input 
                                type="text" 
                                placeholder="Search documentation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        </form>
                    </div>

                    {/* Documentation Content */}
                    {filteredContent.isNotFound ? (
                        <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                            <h3 className="text-lg font-medium text-gray-400">{filteredContent.title}</h3>
                            <p className="text-gray-500">{filteredContent.content}</p>
                        </div>
                    ) : (
                        <article className="prose prose-invert max-w-none">
                            <h1 className="text-4xl font-extrabold text-white mb-4 border-b border-indigo-500/50 pb-2">{filteredContent.title}</h1>
                            <div className="text-gray-300 whitespace-pre-line leading-relaxed text-lg">
                                {filteredContent.content}
                            </div>
                            
                            {/* Code Block (if available) */}
                            {filteredContent.code && (
                                <div className="mt-8 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                                    <div className="bg-gray-800 px-4 py-2 text-sm font-semibold text-indigo-400 border-b border-gray-700">JavaScript Example</div>
                                    <pre className="p-4 overflow-x-auto text-sm bg-black/50 text-green-300">
                                        <code>{filteredContent.code}</code>
                                    </pre>
                                </div>
                            )}

                            {/* Next Document Button */}
                            {filteredContent.next && (
                                <div className="mt-12 pt-6 border-t border-gray-700">
                                    <button 
                                        onClick={() => setActiveDoc(filteredContent.next)}
                                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition"
                                    >
                                        Next: {mockDocsContent[filteredContent.next].title} <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </article>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DocsPage;