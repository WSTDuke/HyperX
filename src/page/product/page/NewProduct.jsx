import React, { useEffect, useState } from "react";
import { Package, Upload, User, CheckCircle, ArrowRight, ArrowLeft, X, Monitor, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../../routes/supabaseClient";
import { Link, useNavigate, useParams } from "react-router-dom";

const NotificationModal = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-800 rounded-lg p-6 border border-red-500/50 shadow-xl w-full max-w-lg">
          <div className="flex gap-3">
            <X className="text-red-400" />
            <div>
              <h3 className="text-lg text-white font-bold">Invalid File</h3>
              <p className="text-red-300 mt-2">{message}</p>
            </div>
          </div>
          <div className="text-right mt-6">
            <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [price, setPrice] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [osTags, setOsTags] = useState([]);

  const [filesByOS, setFilesByOS] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [existingDownloadLinks, setExistingDownloadLinks] = useState({});

  const [uploadProgress, setUploadProgress] = useState({});
  const [imageProgress, setImageProgress] = useState(0);

  const KNOWN_OS = ["Windows", "macOS", "Linux"];

  const VALID_EXT = {
    Windows: ["exe", "msi", "zip", "rar"],
    macOS: ["dmg", "pkg", "zip", "app", "tar"],
    Linux: ["deb", "rpm", "appimage", "tar.gz", "sh"]
  };

  const ACCEPT_ATTR = {
    Windows: ".exe, .msi, .zip, .rar",
    macOS: ".dmg, .pkg, .zip, .app, .tar",
    Linux: ".deb, .rpm, .AppImage, .tar.gz, .sh"
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);

      if (isEditMode) {
        const { data: product } = await supabase.from("products").select("*").eq("id", id).single();
        if (product) {
          setProductName(product.name || "");
          setDescription(product.description || "");
          setInstructions(product.instructions || "");
          setPrice(product.price ?? "");
          const app = Array.isArray(product.tag) ? product.tag.find((t) => ["Software", "Game"].includes(t)) || "" : "";
          const os = Array.isArray(product.tag) ? product.tag.filter((t) => KNOWN_OS.includes(t)) : [];
          setApplicationType(app);
          setOsTags(os);
          setExistingImageUrl(product.image_url || null);
          setExistingDownloadLinks(product.download_links || {});
        }
      }
    })();
  }, [id, isEditMode]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
    // 1. Tạo Signed URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error) throw error;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // QUAN TRỌNG: Phải là PUT để khớp với Signed URL của Supabase
      xhr.open("PUT", data.signedUrl, true);

      // QUAN TRỌNG: Content-Type để tránh lỗi 400
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

      // --- XỬ LÝ THANH TIẾN ĐỘ ---
      if (onProgress) {
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const percent = Math.round((evt.loaded / evt.total) * 100);
            onProgress(percent);
          }
        };
      }
      // ---------------------------

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Lấy Public URL sau khi upload xong
          const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
          resolve(publicData.publicUrl);
        } else {
          // In lỗi từ server nếu có
          reject(`Upload failed: ${xhr.status} - ${xhr.responseText || xhr.statusText}`);
        }
      };

      xhr.onerror = () => reject("Network error during upload.");
      
      // Gửi file
      xhr.send(file);
    });
  };

  const uploadInstaller = async (file, os) => {
    const ext = getExtension(file.name);
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}_${os}.${ext}`;

    return await uploadViaSignedUrl(
      "product-installers",
      safeName,
      file,
      (p) => setUploadProgress((prev) => ({ ...prev, [os]: p }))
    );
  };

  const uploadImage = async (file) => {
    const ext = getExtension(file.name);
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    return await uploadViaSignedUrl(
      "product-images",
      safeName,
      file,
      (p) => setImageProgress(p)
    );
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
      const missing = osTags.filter(
        (os) => !filesByOS[os] && !existingDownloadLinks[os]
      );

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

      let downloadLinks = { ...existingDownloadLinks };

      for (const os of osTags) {
        if (filesByOS[os]) {
          const url = await uploadInstaller(filesByOS[os], os);
          downloadLinks[os] = url;
        }
      }

      const payload = {
        name: productName,
        description,
        instructions,
        price: Number(price) || 0,
        tag: [applicationType, ...osTags],
        image_url: finalImage,
        download_links: downloadLinks,
        ...(isEditMode
          ? {}
          : {
              user_id: user?.id || null,
              name_upload: user?.user_metadata?.full_name || null,
              email_upload: user?.email || null
            })
      };

      const result = isEditMode
        ? await supabase.from("products").update(payload).eq("id", id)
        : await supabase.from("products").insert([payload]);

      if (result.error) throw result.error;

      setMessage(isEditMode ? "Product updated successfully" : "Product created successfully");
      setIsSuccess(true);

      setTimeout(() => navigate("/product"), 900);
    } catch (err) {
      setMessage("Error: " + (err.message || err));
    }

    setLoading(false);
  };


    return (
    <div className="relative isolate px-10 pt-12 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-6xl mx-auto bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

        <div className="flex gap-6">

          <aside className="w-64 border-r border-gray-700 p-4">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Product" : "Create Product"}</h2>

            <div className="space-y-3">
              <div className={`flex items-center gap-3 px-3 py-2 rounded ${currentStep === 1 ? "bg-indigo-600 text-white" : "text-gray-400"}`}>
                <Package className="w-5 h-5" />
                <span>Info</span>
              </div>

              <div className={`flex items-center gap-3 px-3 py-2 rounded ${currentStep === 2 ? "bg-indigo-600 text-white" : "text-gray-400"}`}>
                <Upload className="w-5 h-5" />
                <span>Assets</span>
              </div>

              <div className={`flex items-center gap-3 px-3 py-2 rounded ${currentStep === 3 ? "bg-indigo-600 text-white" : "text-gray-400"}`}>
                <CheckCircle className="w-5 h-5" />
                <span>Review</span>
              </div>
            </div>

            <Link to="/product" className="block mt-6 text-sm text-indigo-400">Cancel</Link>
          </aside>

          <main className="flex-1 pl-6">

            {currentStep === 1 && (
              <div>
                <div className="flex items-center gap-3 text-indigo-400 mb-6">
                  <Package className="w-7 h-7" />
                  <h1 className="text-3xl font-bold">Product Information</h1>
                </div>

                <div className="grid grid-cols-2 gap-8">

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Product Name *</label>
                      <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Usage Instructions</label>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Price ($)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 border-l border-gray-700 pl-8">
                    <div>
                      <label className="block text-sm mb-3 text-indigo-300">Application Type *</label>
                      <div className="space-y-3">
                        {["Software", "Game"].map((app) => (
                          <label
                            key={app}
                            className={`flex items-center p-3 rounded-lg border ${
                              applicationType === app ? "border-indigo-500 bg-indigo-500/10" : "border-gray-700"
                            }`}
                          >
                            <input
                              type="radio"
                              checked={applicationType === app}
                              onChange={() => setApplicationType(app)}
                              className="w-4 h-4 accent-indigo-500"
                            />
                            <span className="ml-3">{app}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-3 text-indigo-300">Supported OS *</label>
                      <div className="space-y-3">
                        {KNOWN_OS.map((os) => (
                          <label
                            key={os}
                            className={`flex items-center p-3 rounded-lg border ${
                              osTags.includes(os) ? "border-indigo-500 bg-indigo-500/10" : "border-gray-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={osTags.includes(os)}
                              onChange={() => handleOSToggle(os)}
                              className="w-4 h-4 accent-indigo-500"
                            />
                            <span className="ml-3">{os}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center gap-3 text-indigo-400 mb-6">
                  <Upload className="w-7 h-7" />
                  <h1 className="text-3xl font-bold">Upload Assets</h1>
                </div>

                <div className="grid gap-6">
                  <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-200">Main Installers</h3>

                    {osTags.length === 0 ? (
                      <p className="text-yellow-400">Please select OS in Step 1.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {osTags.map((os) => (
                          <div key={os} className="space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-3">
                              <Monitor size={18} className="text-slate-400" />

                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white">{os}</p>
                                <p className="text-xs text-slate-500 truncate">
                                  {filesByOS[os]?.name ||
                                    existingDownloadLinks[os]?.split("/").pop() ||
                                    "No file selected"}
                                </p>
                              </div>

                              <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-xs">
                                Upload
                                <input
                                  type="file"
                                  accept={ACCEPT_ATTR[os]}
                                  onChange={(e) => handleFileChange(e, os)}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {uploadProgress[os] > 0 && uploadProgress[os] < 100 && (
  <div className="mt-2">
    <div className="flex justify-between text-xs text-gray-400 mb-1">
      <span>Uploading...</span>
      <span>{uploadProgress[os]}%</span>
    </div>
    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
      <div
        className="bg-indigo-500 h-full transition-all duration-300 ease-out"
        style={{ width: `${uploadProgress[os]}%` }}
      />
    </div>
  </div>
)}
{uploadProgress[os] === 100 && (
  <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
    <CheckCircle size={12} /> Upload Complete
  </div>
)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-200">Cover Image</h3>
                        <p className="text-sm text-gray-400">Upload one main image for your product.</p>
                      </div>

                      {!previewUrl && !existingImageUrl && (
                        <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer">
                          <Upload size={16} /> Choose Image
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                      )}
                    </div>

                    <div className="mt-4">
                      {(previewUrl || existingImageUrl) ? (
                        <div className="space-y-3">
                          <div className="relative w-full max-w-md aspect-video bg-gray-900 rounded-xl overflow-hidden border border-indigo-500/30 group">
                            <img src={previewUrl || existingImageUrl} alt="Cover" className="w-full h-full object-cover" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <label className="cursor-pointer bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg">
                                <Upload size={18} /> Change Image
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              </label>
                            </div>
                          </div>

                          {imageProgress > 0 && imageProgress < 100 && (
  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
    <div className="w-full bg-gray-600 h-1 rounded-full overflow-hidden">
       <div 
         className="bg-green-500 h-full transition-all duration-300" 
         style={{ width: `${imageProgress}%` }} 
       />
    </div>
    <p className="text-center text-[10px] text-white mt-1">{imageProgress}%</p>
  </div>
)}
                        </div>
                      ) : (
                        <label className="w-full max-w-md aspect-video border-2 border-dashed border-gray-600 hover:border-indigo-500 bg-gray-900/50 rounded-xl flex flex-col items-center justify-center cursor-pointer">
                          <ImageIcon size={48} className="text-gray-600 mb-2" />
                          <span className="text-gray-500">Click to upload cover image</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center gap-3 text-indigo-400 mb-6">
                  <CheckCircle className="w-7 h-7" />
                  <h1 className="text-3xl font-bold">Review & Submit</h1>
                </div>

                <div className="space-y-6 bg-gray-800/30 p-6 rounded-2xl border border-white/5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Product Name</p>
                      <p className="font-semibold text-lg">{productName}</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="font-semibold text-lg text-green-400">${price || 0}</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Type</p>
                      <p className="text-medium">{applicationType}</p>
                    </div>

                    <div>
                      <p className="text-gray-400">OS Support</p>
                      <div className="flex gap-2 mt-1">
                        {osTags.map((os) => (
                          <span key={os} className="bg-gray-700 px-2 py-1 rounded text-xs">
                            {os}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Uploaded Packages</p>
                    <div className="space-y-2">
                      {osTags.map((os) => (
                        <div
                          key={os}
                          className="flex justify-between items-center bg-gray-900/50 p-2 rounded border border-gray-700 text-sm"
                        >
                          <span className="text-indigo-300">{os}:</span>
                          <span
                            className={
                              filesByOS[os] || existingDownloadLinks[os]
                                ? "text-green-400"
                                : "text-yellow-500 italic"
                            }
                          >
                            {filesByOS[os]?.name ||
                              existingDownloadLinks[os]?.split("/").pop() ||
                              (isEditMode ? "Unchanged (missing new file)" : "Missing file")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Cover Image</p>

                    {(previewUrl || existingImageUrl) && (
                      <div className="mt-2">
                        <img
                          src={previewUrl || existingImageUrl}
                          alt="Preview"
                          className="h-16 w-28 object-cover rounded border border-slate-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-700/50">
              {message && (
                <div
                  className={`mb-4 px-4 py-3 rounded-lg text-sm font-semibold flex items-center ${
                    isSuccess
                      ? "bg-green-900/30 text-green-400 border border-green-800"
                      : "bg-red-900/30 text-red-400 border-red-800"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex justify-between items-center">
                {currentStep > 1 && !isSuccess ? (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                  >
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <>
                    {isSuccess ? (
                      <Link
                        to="/product"
                        className="flex items-center px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
                      </Link>
                    ) : (
                      <button
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        className={`flex items-center px-8 py-3 rounded-xl font-bold text-white ${
                          loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
                        }`}
                      >
                        {loading ? "Processing..." : isEditMode ? "Save Changes" : "Submit Product"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

          </main>
        </div>
      </div>

      <NotificationModal
        message={modalMessage}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default NewProduct;
