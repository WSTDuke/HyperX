import { useState, useEffect } from "react";
import { supabase } from "../routes/supabaseClient";
import { useNavigate } from "react-router-dom";

export const useProductDetail = (id) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const KNOWN_OS = ["Windows", "macOS", "Linux"];

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

      const enrichedProduct = { ...productData, profiles: profile };
      setProduct(enrichedProduct);

      let query = supabase
        .from("products")
        .select("*")
        .neq("id", id)
        .limit(5)
        .order("created_at", { ascending: false });

      if (productData.tag?.[0]) {
        query = query.contains("tag", [productData.tag[0]]);
      }
      const { data: related } = await query;
      setRelatedProducts(related || []);

      setIsLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    const handleAvatarUpdated = async () => {
      if (!product?.email_upload) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", product.email_upload)
        .maybeSingle();
      if (p) setProduct((prev) => (prev ? { ...prev, profiles: p } : prev));
    };
    window.addEventListener("hyperx-avatar-updated", handleAvatarUpdated);
    return () => window.removeEventListener("hyperx-avatar-updated", handleAvatarUpdated);
  }, [product?.email_upload]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      navigate("/product");
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
    setIsDeleting(false);
  };

  const handleDownloadAction = async (osName) => {
    const url = product?.download_links?.[osName];
    if (!url) {
      alert(`No installer found for ${osName}`);
      return;
    }

    try {
      const rawName = url.split("/").pop().split("?")[0];
      const originalName = rawName.includes("_")
        ? rawName.split("_").slice(1).join("_")
        : rawName;
      const finalDownloadName =
        originalName || `${product.name.replace(/\s+/g, "_")}_${osName}`;

      setShowModal(false);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = finalDownloadName;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.click();
    }
  };

  const getOSTags = () => {
    if (!product || !product.tag) return [];
    return product.tag.filter((t) => KNOWN_OS.includes(t));
  };

  return {
    state: {
      product,
      relatedProducts,
      isLoading,
      showModal,
      showDeleteModal,
      isDeleting,
      showMenu,
    },
    actions: {
      setShowModal,
      setShowDeleteModal,
      setShowMenu,
      handleConfirmDelete,
      handleDownloadAction,
      getOSTags,
    },
    constants: {
      KNOWN_OS,
    }
  };
};
