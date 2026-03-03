import { useState, useEffect } from "react";
import { supabase } from "../routes/supabaseClient";
import { useNavigate } from "react-router-dom";

const KNOWN_OS = ["Windows", "macOS", "Linux"];
const VALID_EXT = {
  Windows: ["exe", "msi", "zip", "rar"],
  macOS: ["dmg", "pkg", "zip", "app", "tar"],
  Linux: ["deb", "rpm", "appimage", "tar.gz", "sh"],
};
const MAX_FILE_SIZE = 500 * 1024 * 1024;
const ACCEPT_ATTR = {
  Windows: ".exe, .msi, .zip, .rar",
  macOS: ".dmg, .pkg, .zip, .app, .tar",
  Linux: ".deb, .rpm, .AppImage, .tar.gz, .sh",
};

const getExtension = (fileName) => {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".tar.gz")) return "tar.gz";
  const parts = lower.split(".");
  return parts.length > 1 ? parts.pop() : "";
};

const isFileAllowed = (fileName, osName) => {
  const ext = getExtension(fileName);
  return VALID_EXT[osName]?.includes(ext);
};

export const useProductUpload = ({ passingUser, id, isEditMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(passingUser);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [author, setAuthor] = useState("");
  const [osTags, setOsTags] = useState([]);

  const [filesByOS, setFilesByOS] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [existingDownloadLinks, setExistingDownloadLinks] = useState({});

  const [uploadProgress, setUploadProgress] = useState({});
  const [imageProgress, setImageProgress] = useState(0);

  useEffect(() => {
    if (passingUser) setUser(passingUser);
  }, [passingUser]);

  useEffect(() => {
    if (isEditMode && id) {
      (async () => {
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (product) {
          setProductName(product.name || "");
          setDescription(product.description || "");
          setInstructions(product.instructions || "");
          setAuthor(product.author || "");
          const tags = Array.isArray(product.tag)
            ? product.tag
            : typeof product.tag === "string"
              ? product.tag.split(",").map((t) => t.trim())
              : [];
          const app = tags.find((t) => ["Software", "Game"].includes(t)) || "";
          const os = tags.filter((t) => KNOWN_OS.includes(t));
          setApplicationType(app);
          setOsTags(os);
          setExistingImageUrl(product.image_url || null);
          setExistingDownloadLinks(product.download_links || {});
        }
      })();
    }
  }, [id, isEditMode]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleOSToggle = (os) => {
    setOsTags((prev) => {
      const exists = prev.includes(os);
      if (exists) {
        const copy = prev.filter((x) => x !== os);
        setFilesByOS((f) => {
          const copyF = { ...f };
          delete copyF[os];
          return copyF;
        });
        return copy;
      } else {
        return [...prev, os];
      }
    });
  };

  const handleFileChange = (e, os) => {
    setModalMessage("");
    setIsModalVisible(false);
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!isFileAllowed(file.name, os)) {
      setModalMessage(`File type does not match ${os}. Accepted: ${ACCEPT_ATTR[os]}`);
      setIsModalVisible(true);
      e.target.value = null;
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setModalMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum allowed is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please contact administrator or increase the limit.`
      );
      setIsModalVisible(true);
      e.target.value = null;
      return;
    }

    setFilesByOS((prev) => ({ ...prev, [os]: file }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadViaSignedUrl = async (bucket, filePath, file, onProgress) => {
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath);
    if (error) throw error;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", data.signedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

      if (onProgress) {
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const percent = Math.round((evt.loaded / evt.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
          resolve(publicData.publicUrl);
        } else {
          reject(`Upload failed: ${xhr.status} - ${xhr.responseText || xhr.statusText}`);
        }
      };
      xhr.onerror = () => reject("Network error during upload.");
      xhr.send(file);
    });
  };

  const uploadInstaller = async (file, os) => {
    const safeName = `${Date.now()}_${file.name}`;
    return await uploadViaSignedUrl("product-installers", safeName, file, (p) =>
      setUploadProgress((prev) => ({ ...prev, [os]: p }))
    );
  };

  const uploadImage = async (file) => {
    const ext = getExtension(file.name);
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    return await uploadViaSignedUrl("product-images", safeName, file, (p) => setImageProgress(p));
  };

  const handleNext = () => {
    setMessage("");
    if (currentStep === 1) {
      if (!productName.trim() || !applicationType || osTags.length === 0) {
        setMessage("Please fill Product Name, Application Type and select at least one OS.");
        return;
      }
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      const missing = osTags.filter((os) => !filesByOS[os] && !existingDownloadLinks[os]);
      if (!isEditMode && missing.length > 0) {
        setMessage(`Please upload installers for: ${missing.join(", ")}`);
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((c) => c - 1);
      setMessage("");
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      let finalImage = existingImageUrl;
      if (selectedImage) {
        finalImage = await uploadImage(selectedImage);
      }

      let downloadLinks = {};
      for (const os of osTags) {
        if (filesByOS[os]) {
          const url = await uploadInstaller(filesByOS[os], os);
          downloadLinks[os] = url;
        } else if (existingDownloadLinks[os]) {
          downloadLinks[os] = existingDownloadLinks[os];
        }
      }

      const payload = {
        name: productName,
        description,
        instructions,
        author,
        tag: [applicationType, ...osTags].filter(Boolean),
        image_url: finalImage,
        download_links: downloadLinks,
        ...(isEditMode
          ? {}
          : {
              user_id: user?.id || null,
              name_upload: user?.user_metadata?.full_name || null,
              email_upload: user?.email || null,
            }),
      };

      const result = isEditMode
        ? await supabase.from("products").update(payload).eq("id", id).select()
        : await supabase.from("products").insert([payload]).select();

      if (result.error) throw result.error;

      if (isEditMode && (!result.data || result.data.length === 0)) {
        throw new Error("You might not have permission to edit this product or the product no longer exists.");
      }

      setMessage(isEditMode ? "Product updated successfully!" : "Product created successfully!");
      setIsSuccess(true);
      setTimeout(() => navigate("/product"), 900);
    } catch (err) {
      const errorMsg = err.message || String(err);
      if (
        errorMsg.includes("413") ||
        errorMsg.toLowerCase().includes("payload too large") ||
        errorMsg.toLowerCase().includes("exceeded the maximum allowed size")
      ) {
        setMessage(
          "Upload failed: File size exceeds the server's maximum limit. Please increase the limit in Supabase Storage or upload a smaller file."
        );
      } else {
        setMessage("Error: " + errorMsg);
      }
    }
    setLoading(false);
  };

  return {
    state: {
      currentStep,
      loading,
      message,
      isSuccess,
      modalMessage,
      isModalVisible,
      productName,
      description,
      instructions,
      applicationType,
      author,
      osTags,
      filesByOS,
      selectedImage,
      previewUrl,
      existingImageUrl,
      existingDownloadLinks,
      uploadProgress,
      imageProgress,
    },
    actions: {
      setProductName,
      setDescription,
      setInstructions,
      setApplicationType,
      setAuthor,
      handleOSToggle,
      handleFileChange,
      handleImageChange,
      handleNext,
      handlePrevious,
      handleFinalSubmit,
      setIsModalVisible,
    },
    constants: {
      KNOWN_OS,
      ACCEPT_ATTR,
    }
  };
};
