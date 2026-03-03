import React, { useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Edit,
  Trash2,
  Clock,
  Download,
  MoreVertical,
  Monitor,
  Mail,
  User as UserIcon,
} from "lucide-react";
import UserAvatar from "../../../components/UserAvatar";
import { useProductDetail } from "../../../hooks/useProductDetail";
import { ProductDetailSkeleton } from "../components/ProductDetailSkeleton";
import { RelatedProducts } from "../components/RelatedProducts";
import { ProductModals } from "../components/ProductModals";

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const relatedListRef = useRef(null);
  const menuRef = useRef(null);

  const { state, actions, constants } = useProductDetail(id);

  const {
    product,
    relatedProducts,
    isLoading,
    showModal,
    showDeleteModal,
    isDeleting,
    showMenu,
  } = state;

  const {
    setShowModal,
    setShowDeleteModal,
    setShowMenu,
    handleConfirmDelete,
    handleDownloadAction,
    getOSTags,
  } = actions;

  const { KNOWN_OS } = constants;

  const scroll = (direction) => {
    if (!relatedListRef.current) return;
    const offset = 320;
    relatedListRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product)
    return (
      <main className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center text-gray-400 gap-4">
        <div className="p-6 bg-white/5 rounded-full border border-white/10">
          <Package size={48} className="opacity-50" />
        </div>
        <h2 className="text-xl font-bold text-white">Product not found</h2>
        <button
          onClick={() => navigate("/product")}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]"
        >
          Back to Marketplace
        </button>
      </main>
    );

  const availableOS = getOSTags();
  const userName =
    product?.profiles?.full_name || product?.name_upload || "Unknown";
  const userEmail =
    product?.profiles?.email || product?.email_upload || "Unknown";
  const uploaderForAvatar = {
    id: product?.profiles?.id || product?.user_id,
    full_name: userName,
    email: userEmail,
    avatar_url: product?.profiles?.avatar_url || null,
  };
  const isOwner =
    user?.id === product?.user_id || user?.email === product?.email_upload;

  return (
    <main
      ref={scrollRef}
      className="bg-[#05050A] min-h-screen pt-20 pb-12 relative isolate overflow-hidden"
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="fixed top-0 right-0 -z-10 w-[40rem] h-[40rem] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="p-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/product")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Products
          </button>

          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <MoreVertical size={20} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-[#0B0D14] border border-white/10 rounded-xl shadow-2xl w-48 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  <Link
                    to={`/product/edit/${product.id}`}
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 text-gray-300 transition-colors"
                  >
                    <Edit size={16} /> Edit Product
                  </Link>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="group relative">
              <div className="relative tech-card border-glow-cyan p-2 rounded-2xl shadow-2xl overflow-hidden group/img">
                <div className="aspect-square bg-gray-900/50 rounded-xl overflow-hidden flex items-center justify-center relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                    />
                  ) : (
                    <Package size={80} className="text-gray-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                </div>
              </div>
            </div>

            <div className="tech-card group p-6 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package size={80} className="rotate-12 text-cyan-500" />
              </div>
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur group-hover:opacity-100 opacity-0 transition"></div>
                  <UserAvatar
                    user={uploaderForAvatar}
                    size="lg"
                    className="relative border-2 border-white/10"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-cyan-500 uppercase font-black tracking-[0.2em] mb-1">
                    Uploaded By
                  </p>
                  <h3 className="text-white font-bold text-lg truncate mb-0.5">
                    {userName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Mail size={12} className="text-gray-600" />
                    <p className="text-xs truncate font-medium">{userEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowModal(true)}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-4 text-white font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Download size={22} className="group-hover:bounce" />
                  <span>Get {product.name}</span>
                </div>
              </button>

              <p className="text-[10px] text-center text-gray-500 font-medium uppercase tracking-widest">
                Safe & Secure Checkout with HyperX
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {availableOS.map((os) => (
                  <span
                    key={os}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500/20 transition-all cursor-default"
                  >
                    <Monitor size={12} /> {os}
                  </span>
                ))}
                {product.tag?.map(
                  (t) =>
                    !KNOWN_OS.includes(t) && (
                      <span
                        key={t}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest"
                      >
                        {t}
                      </span>
                    ),
                )}
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase glow-text-cyan">
                {product.name}
              </h1>

              <div className="h-1 w-20 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-full"></div>

              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
                {product.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="tech-card group p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <Clock size={18} />
                  </div>
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                    Upload date
                  </p>
                </div>
                <p className="text-white font-mono text-lg glow-text-cyan">
                  {new Date(product.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="tech-card group p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <UserIcon size={18} />
                  </div>
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                    Author / Developer
                  </p>
                </div>
                <p className="text-white font-mono text-lg glow-text-cyan">
                  {product.author || "Independent Developer"}
                </p>
              </div>
            </div>

            {product.instructions && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl blur opacity-50"></div>
                <div className="relative tech-card p-8 rounded-2xl border border-white/10 shadow-2xl">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter glow-text-cyan">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      <Monitor size={18} />
                    </div>
                    Installation Guide
                  </h3>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="font-mono text-sm text-gray-400 leading-relaxed bg-black/40 p-6 rounded-xl border border-white/5 whitespace-pre-line selection:bg-cyan-500/30">
                      {product.instructions}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <RelatedProducts
          relatedProducts={relatedProducts}
          relatedListRef={relatedListRef}
          scroll={scroll}
        />
      </div>

      <ProductModals
        showModal={showModal}
        setShowModal={setShowModal}
        availableOS={availableOS}
        handleDownloadAction={handleDownloadAction}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        isDeleting={isDeleting}
        handleConfirmDelete={handleConfirmDelete}
      />
    </main>
  );
};

export default ProductDetail;
