import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../routes/supabaseClient';

import {
    ArrowLeft, Package, Edit, Trash2,
    DollarSign, Clock, CheckCircle2,
    ArrowRight, ChevronLeft, ChevronRight,
    X, Download, AlertTriangle, MoreVertical
} from 'lucide-react';

import UserAvatar from '../../community/UserAvatar';

const ProductDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const scrollRef = useRef(null);
    const relatedListRef = useRef(null);
    const menuRef = useRef(null);

    const [product, setProduct] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showMenu, setShowMenu] = useState(false);

    const KNOWN_OS = ["Windows", "macOS", "Linux"];

    const formatCurrency = (amount) => {
        if (amount === 0 || amount === undefined) return "Free";
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const scroll = (direction) => {
        if (!relatedListRef.current) return;
        const offset = 340;
        relatedListRef.current.scrollBy({
            left: direction === "left" ? -offset : offset,
            behavior: "smooth"
        });
    };

    // ==============================
    // DELETE PRODUCT
    // ==============================
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (error) throw error;

            navigate("/product");
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
        setIsDeleting(false);
    };

    // ==============================
    // DOWNLOAD INSTALLER
    // ==============================
    const handleDownloadAction = (osName) => {
        const url = product?.download_links?.[osName];

        if (!url) {
            alert(`No installer found for ${osName}`);
            return;
        }

        const a = document.createElement("a");
        a.href = url;
        a.download = `${product.name.replace(/\s+/g, "_")}_${osName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setShowModal(false);
    };

    // ==============================
    // CLICK OUTSIDE FOR DROPDOWN
    // ==============================
    useEffect(() => {
        const handler = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ==============================
    // FETCH PRODUCT + RELATED
    // ==============================
    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: productData, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !productData) {
                setProduct(null);
                setIsLoading(false);
                return;
            }

            let profile = {};

            if (productData.email_upload) {
                const { data: p } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("email", productData.email_upload)
                    .maybeSingle();
                if (p) profile = p;
            }

            const enrichedProduct = {
                ...productData,
                profiles: profile
            };

            setProduct(enrichedProduct);

            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) setCurrentUser(userData.user);

            // fetch related products
            let query = supabase
                .from("products")
                .select("*")
                .neq("id", id)
                .limit(8)
                .order("created_at", { ascending: false });

            if (productData.tag?.[0]) {
                query = query.contains("tag", JSON.stringify([productData.tag[0]]));
            }

            const { data: related } = await query;
            setRelatedProducts(related || []);

            setIsLoading(false);
        })();
    }, [id]);

    const getOSTags = () => {
        if (!product || !product.tag) return [];
        return product.tag.filter(t => KNOWN_OS.includes(t));
    };

    if (isLoading)
        return (
            <main className="flex-1 h-screen bg-[#0f172a] flex items-center justify-center text-indigo-400">
                Loading...
            </main>
        );

    if (!product)
        return (
            <main className="flex-1 h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-400">
                <Package size={64} className="opacity-50 mb-4" />
                Product not found
                <button
                    onClick={() => navigate("/product")}
                    className="mt-3 px-4 py-2 bg-slate-800 text-white rounded"
                >
                    Back
                </button>
            </main>
        );

    const availableOS = getOSTags();
    const userName = product?.profiles?.full_name || product?.name_upload || "Unknown";
    const userEmail = product?.profiles?.email || product?.email_upload || "Unknown";

    const uploaderForAvatar = {
        id: product?.profiles?.id || product?.user_id,
        full_name: userName,
        email: userEmail,
        avatar_url: product?.profiles?.avatar_url || null
    };

    const isOwner = currentUser?.email === product.email_upload;

    return (
        <main ref={scrollRef} className="flex-1 bg-[#0f172a] pt-18 overflow-y-auto custom-scrollbar">

            <div className="p-6 md:px-10 max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate("/product")}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    {isOwner && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <MoreVertical size={20} />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl w-48">
                                    <Link
                                        to={`/product/edit/${product.id}`}
                                        onClick={() => setShowMenu(false)}
                                        className="block px-4 py-3 hover:bg-slate-700 text-slate-300"
                                    >
                                        <Edit size={16} className="inline mr-2" /> Edit Product
                                    </Link>

                                    <button
                                        onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                                        className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 size={16} className="inline mr-2" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-5 space-y-6">

                        <div className="bg-[#1e293b] p-2 rounded-xl border border-slate-700">
                            <div className="aspect-square bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                                {product.image_url ? (
                                    <img src={product.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <Package size={80} className="text-slate-600" />
                                )}
                            </div>
                        </div>

                        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                            <p className="text-slate-500 text-xs uppercase font-bold mb-2">
                                Created by
                            </p>

                            <div className="flex items-center gap-3">
                                <UserAvatar user={uploaderForAvatar} size="md" />
                                <div>
                                    <p className="text-white">{userName}</p>
                                    <p className="text-slate-400 text-sm">{userEmail}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-green-600 hover:bg-green-500 p-4 rounded-xl text-white font-medium"
                        >
                            Download Now – <DollarSign size={14} className="inline" /> {product.price}
                        </button>

                    </div>

                    {/* RIGHT SIDE DETAIL */}
                    <div className="lg:col-span-7 space-y-8">

                        <h1 className="text-4xl text-white font-bold">
                            {product.name}
                        </h1>

                        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
                            <h3 className="text-lg text-white font-semibold mb-3">Description</h3>
                            <p className="text-slate-300 whitespace-pre-line">
                                {product.description || "No description"}
                            </p>
                        </div>

                        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>

                            <div className="space-y-4">

                                <div className="flex justify-between py-3 border-b border-slate-700">
                                    <span className="text-slate-400">Created</span>
                                    <span className="text-white font-medium">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between py-3">
                                    <span className="text-slate-400">Supported OS</span>

                                    <div className="flex gap-2">
                                        {availableOS.map(os => (
                                            <span key={os} className="px-3 py-1 rounded-full bg-slate-800 text-white text-xs">
                                                {os}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {product.instructions && (
                            <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
                                <h3 className="text-lg font-semibold text-white mb-4">Instructions</h3>
                                <p className="text-slate-300 whitespace-pre-line">
                                    {product.instructions}
                                </p>
                            </div>
                        )}

                    </div>

                </div>

                {/* RELATED PRODUCTS — giữ nguyên logic của bạn */}

            </div>

            {/* =======================
                DOWNLOAD MODAL
            ======================= */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>

                    <div className="relative bg-[#1e293b] p-6 rounded-xl border border-slate-700 max-w-md w-full">
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => setShowModal(false)}>
                            <X size={20} />
                        </button>

                        <h3 className="text-white text-lg font-bold mb-2">Select Platform</h3>
                        <p className="text-slate-400 mb-6">Choose your operating system.</p>

                        <div className="space-y-3">
                            {availableOS.map(os => (
                                <button
                                    key={os}
                                    onClick={() => handleDownloadAction(os)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex justify-between"
                                >
                                    Download for {os}
                                    <Download size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* =======================
                DELETE MODAL
            ======================= */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteModal(false)} />

                    <div className="bg-[#1e293b] border border-red-400/30 p-6 rounded-xl max-w-sm w-full">
                        <h3 className="text-white font-bold text-xl mb-2">Delete Product?</h3>
                        <p className="text-slate-300 mb-6">Are you sure? This action cannot be undone.</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductDetail;
