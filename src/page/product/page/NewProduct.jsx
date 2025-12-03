import { Package, Upload, User, CheckCircle, ArrowRight, ArrowLeft, X, Monitor, Image as ImageIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewProduct = () => {
    
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    // Biến xác định đích đến khi back
    const backLink = isEditMode ? `/product/${id}` : "/product";
    const backText = isEditMode ? "Back to Detail" : "Back to Products";

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [productData, setProductData] = useState({
        productName: "", description: "", instructions: "", price: "",
    });
    const [tags, setTags] = useState({ application: "", os: [] });
    const [filesByOS, setFilesByOS] = useState({}); 
    
    // --- CẬP NHẬT: State cho 1 ảnh duy nhất ---
    const [selectedImage, setSelectedImage] = useState(null); // File object mới
    const [previewUrl, setPreviewUrl] = useState(null);       // URL preview của file mới
    const [existingImageUrl, setExistingImageUrl] = useState(null); // URL ảnh cũ từ DB

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) setUser(user);

                if (isEditMode) {
                    const { data: product, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', id)
                        .single();
                    if (error) throw error;
                    if (product) {
                        setProductData({
                            productName: product.name,
                            description: product.description || "",
                            instructions: product.instructions || "",
                            price: product.price
                        });
                        const appTag = product.tag.find(t => ["Software", "Game"].includes(t)) || "";
                        const osTags = product.tag.filter(t => ["Windows", "macOS", "Linux"].includes(t));
                        setTags({ application: appTag, os: osTags });
                        
                        // Xử lý ảnh cũ: Nếu DB lưu mảng, lấy ảnh đầu tiên. Nếu string, lấy luôn.
                        let img = null;
                        if (Array.isArray(product.image_url) && product.image_url.length > 0) {
                            img = product.image_url[0];
                        } else if (typeof product.image_url === 'string') {
                            img = product.image_url;
                        }
                        setExistingImageUrl(img);
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                setMessage("Failed to load product data.");
            } finally { setLoading(false); }
        };
        initData();
    }, [id, isEditMode]);

    // Cleanup preview URL khi unmount hoặc đổi ảnh
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };
    const handleApplicationSelect = (value) => setTags(prev => ({ ...prev, application: value }));
    const handleOSSelect = (value) => { 
        setTags(prev => {
            const exists = prev.os.includes(value);
            let newOSList = exists ? prev.os.filter(os => os !== value) : [...prev.os, value];
            if(exists) { const newFiles = { ...filesByOS }; delete newFiles[value]; setFilesByOS(newFiles); }
            return { ...prev, os: newOSList };
        });
    };
    const handleFileChangeForOS = (e, osName) => { 
        if (e.target.files && e.target.files.length > 0) setFilesByOS(prev => ({ ...prev, [osName]: e.target.files }));
    };

    // --- CẬP NHẬT: Logic chọn 1 ảnh ---
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // Xóa preview cũ nếu có
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            
            // Tạo preview mới
            setPreviewUrl(URL.createObjectURL(file));
            setSelectedImage(file);
        }
    };

    // Hàm xóa ảnh (Optional: nếu muốn cho phép xóa trắng)
    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        // Lưu ý: Không xóa existingImageUrl ở đây để user có thể "Cancel" việc chọn ảnh mới và quay về ảnh cũ nếu muốn logic phức tạp hơn, 
        // nhưng đơn giản nhất là: nếu xóa selectedImage thì nó sẽ hiện lại existingImageUrl (nếu có).
        // Tuy nhiên, nếu user muốn XÓA HẲN ảnh cũ, cần logic phức tạp hơn. 
        // Ở đây tôi giả định "Remove" là gỡ ảnh đang chọn (preview).
    };

    const handleNext = () => { 
        setMessage("");
        if (currentStep === 1) {
            if (!productData.productName || !tags.application || tags.os.length === 0) {
                setMessage("Please fill in Product Name, Application, and select at least one OS.");
                return;
            }
            if (!productData.price && productData.price !== 0) setProductData(prev => ({ ...prev, price: "0" }));
            setCurrentStep(2);
        } else if (currentStep === 2) setCurrentStep(3);
    };
    const handlePrevious = () => { if (currentStep > 1) { setCurrentStep(prev => prev - 1); setMessage(""); } };

    // --- CẬP NHẬT: Upload 1 ảnh ---
    const uploadMainImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error } = await supabase.storage.from('product-images').upload(filePath, file);
        if (error) throw error;
        
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleFinalSubmit = async () => { 
        setLoading(true); setMessage(""); setIsSuccess(false);
        if (!user) { setMessage("Error: You must be logged in."); setLoading(false); return; }
        try {
            let finalImageUrl = existingImageUrl;
            
            // Nếu có chọn ảnh mới thì upload và lấy URL mới
            if (selectedImage) {
                finalImageUrl = await uploadMainImage(selectedImage);
            }

            const combinedTags = [tags.application, ...tags.os];
            const payload = {
                name: productData.productName,
                description: productData.description,
                instructions: productData.instructions, 
                price: parseFloat(productData.price) || 0,
                tag: combinedTags, 
                image_url: finalImageUrl, // Lưu string URL duy nhất
                ...(isEditMode ? {} : { user_id: user.id, name_upload: user.user_metadata?.full_name || 'Unknown', email_upload: user.email })
            };

            const { error } = isEditMode 
                ? await supabase.from('products').update(payload).eq('id', id)
                : await supabase.from('products').insert([payload]);

            if (error) throw error;
            setMessage(isEditMode ? "Product updated successfully!" : "Product added successfully!");
            setIsSuccess(true);
        } catch (error) { 
            console.error(error);
            setMessage("Failed: " + error.message); setIsSuccess(false); 
        } 
        finally { setLoading(false); }
    };

    const steps = [
        { id: 1, label: "Info", icon: Package },
        { id: 2, label: "Assets", icon: Upload },
        { id: 3, label: "Review", icon: CheckCircle },
    ];

    return (
        <div className="relative isolate px-36 pt-24 bg-gray-900 overflow-hidden text-gray-100 ">
            <div className='h-screen mb-24 flex'>
                 <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[1155px] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[2300px]" />
                </div>

                <div className="relative w-full max-w-7xl bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex overflow-hidden">

                    {/* --- SIDEBAR --- */}
                    <aside className="w-72 border-r border-gray-700 p-8 flex flex-col">
                        <h2 className="text-2xl font-bold mb-8 text-white">
                            {isEditMode ? "Edit Product" : "Create Product"}
                        </h2>
                        <div className="space-y-4 flex-1">
                            {steps.map((step) => {
                                const Icon = step.icon;
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;
                                return (
                                    <div key={step.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : isCompleted ? "text-green-400 bg-green-900/20" : "text-gray-500"}`}>
                                        <Icon className={`w-5 h-5 ${isCompleted ? "text-green-400" : ""}`} />
                                        <span className="font-medium">{step.label}</span>
                                        {isCompleted && <CheckCircle className="w-4 h-4 ml-auto" />}
                                    </div>
                                );
                            })}
                        </div>
                        <Link to={backLink} className="mt-auto text-center py-3 text-indigo-400 text-sm hover:text-indigo-300 transition">
                            Cancel & {isEditMode ? "Back to Detail" : "Back to List"}
                        </Link>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <main className="flex-1 px-10 py-8 overflow-y-auto custom-scrollbar">
                        {currentStep === 1 && (
                             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center mb-8 text-indigo-400"><Package className="w-8 h-8 mr-3" /><h2 className="text-3xl font-bold text-white">Product Information</h2></div>
                                <div className="grid grid-cols-2 gap-12">
                                     <div className="space-y-6">
                                        <div><label className="block text-sm font-medium mb-2">Product Name *</label><input type="text" name="productName" value={productData.productName} onChange={handleChange} className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-indigo-500 outline-none" /></div>
                                        <div><label className="block text-sm font-medium mb-2">Description</label><textarea name="description" rows="4" value={productData.description} onChange={handleChange} className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-indigo-500 outline-none" /></div>
                                        <div><label className="block text-sm font-medium mb-2">Usage Instructions</label><textarea name="instructions" rows="4" value={productData.instructions} onChange={handleChange} className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-indigo-500 outline-none" /></div>
                                        <div><label className="block text-sm font-medium mb-2">Price ($)</label><input type="number" name="price" value={productData.price} onChange={handleChange} className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-indigo-500 outline-none" /></div>
                                     </div>
                                     <div className="space-y-8 border-l border-gray-700 pl-12">
                                        <div><label className="block text-sm font-medium mb-3 text-indigo-300">Application Type *</label><div className="space-y-3">{["Software", "Game"].map(app => (<label key={app} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${tags.application === app ? "border-indigo-500 bg-indigo-500/10" : "border-gray-700 hover:border-gray-500"}`}><input type="radio" name="application" checked={tags.application === app} onChange={() => handleApplicationSelect(app)} className="w-4 h-4 accent-indigo-500" /><span className="ml-3 font-medium">{app}</span></label>))}</div></div>
                                        <div><label className="block text-sm font-medium mb-3 text-indigo-300">Supported OS *</label><div className="space-y-3">{["Windows", "macOS", "Linux"].map(os => (<label key={os} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${tags.os.includes(os) ? "border-indigo-500 bg-indigo-500/10" : "border-gray-700 hover:border-gray-500"}`}><input type="checkbox" checked={tags.os.includes(os)} onChange={() => handleOSSelect(os)} className="w-4 h-4 accent-indigo-500 rounded" /><span className="ml-3 font-medium">{os}</span></label>))}</div></div>
                                     </div>
                                </div>
                             </div>
                        )}
                        {currentStep === 2 && (
                             <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                <div className="flex items-center mb-6 text-indigo-400"><Upload className="w-8 h-8 mr-3" /><h2 className="text-3xl font-bold text-white">Upload Assets</h2></div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    {/* OS Files Upload */}
                                    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                                        <h3 className="text-lg font-semibold mb-4 text-indigo-200">Main Installers</h3>
                                        {tags.os.length === 0 ? <p className="text-yellow-400">Please select OS in Step 1.</p> : 
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {tags.os.map(osName => (
                                                <div key={osName} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                                    <Monitor size={18} className="text-slate-400" />
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-medium text-white">{osName}</p>
                                                        <p className="text-xs text-slate-500 truncate">{filesByOS[osName] ? filesByOS[osName][0].name : "No file selected"}</p>
                                                    </div>
                                                    <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-xs transition">
                                                        Upload <input type="file" className="hidden" onChange={(e) => handleFileChangeForOS(e, osName)} />
                                                    </label>
                                                </div>
                                            ))}
                                         </div>
                                        }
                                    </div>

                                    {/* --- CẬP NHẬT: Single Image Upload Section --- */}
                                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-indigo-200">Cover Image</h3>
                                                <p className="text-sm text-gray-400">Upload one main image for your product.</p>
                                            </div>
                                            {/* Nút Upload chỉ hiện khi chưa có ảnh nào */}
                                            {!previewUrl && !existingImageUrl && (
                                                <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer transition shadow-lg shadow-indigo-600/20">
                                                    <Upload size={16} /> Choose Image
                                                    {/* Lưu ý: Bỏ multiple */}
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>

                                        {/* Khu vực hiển thị ảnh (Preview hoặc Existing) */}
                                        <div className="mt-4">
                                            {(previewUrl || existingImageUrl) ? (
                                                <div className="relative w-full max-w-md aspect-video bg-gray-900 rounded-xl overflow-hidden border border-indigo-500/30 group">
                                                    <img 
                                                        src={previewUrl || existingImageUrl} 
                                                        alt="Cover" 
                                                        className="w-full h-full object-cover transition duration-300 group-hover:brightness-50" 
                                                    />
                                                    
                                                    {/* Overlay Change Image */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                                        <label className="cursor-pointer bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-white/50">
                                                            <Upload size={18} /> Change Image
                                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                        </label>
                                                    </div>

                                                    {/* Badge báo trạng thái */}
                                                    <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white shadow-sm bg-black/50 backdrop-blur-md border border-white/10">
                                                        {previewUrl ? "New" : "Saved"}
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Placeholder khi chưa có ảnh */
                                                <label className="w-full max-w-md aspect-video border-2 border-dashed border-gray-600 hover:border-indigo-500 bg-gray-900/50 hover:bg-gray-800/80 rounded-xl flex flex-col items-center justify-center cursor-pointer transition group">
                                                    <ImageIcon size={48} className="text-gray-600 group-hover:text-indigo-400 mb-2 transition" />
                                                    <span className="text-gray-500 group-hover:text-gray-300 font-medium">Click to upload cover image</span>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}
                        
                        {/* --- STEP 3: REVIEW & SUBMIT (GIAO DIỆN CŨ) --- */}
                        {currentStep === 3 && (
                             <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl">
                                <div className="flex items-center mb-8 text-indigo-400">
                                    <CheckCircle className="w-8 h-8 mr-3" />
                                    <h2 className="text-3xl font-bold text-white">Review & {isEditMode ? "Save" : "Submit"}</h2>
                                </div>

                                <div className="space-y-6 bg-gray-800/30 p-8 rounded-2xl border border-white/5">
                                    {/* Summary Info */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400">Product Name</p>
                                            <p className="font-semibold text-lg">{productData.productName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Price</p>
                                            <p className="font-semibold text-lg text-green-400">${productData.price || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Type</p>
                                            <p className="font-medium">{tags.application}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">OS Support</p>
                                            <div className="flex gap-2 mt-1">
                                                {tags.os.map(os => (
                                                    <span key={os} className="bg-gray-700 px-2 py-1 rounded text-xs">{os}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* List file upload */}
                                    <div className="border-t border-gray-700 pt-4">
                                        <p className="text-gray-400 text-sm mb-2">Uploaded Packages</p>
                                        <div className="space-y-2">
                                            {tags.os.map(os => (
                                                <div key={os} className="flex justify-between items-center bg-gray-900/50 p-2 rounded border border-gray-700 text-sm">
                                                    <span className="text-indigo-300">{os}:</span>
                                                    <span className={filesByOS[os] ? "text-green-400" : "text-gray-500 italic"}>
                                                        {filesByOS[os] ? filesByOS[os][0].name : (isEditMode ? "Unchanged" : "Missing file")}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* --- CẬP NHẬT: Hiển thị thông báo ảnh (1 ảnh) --- */}
                                    <div className="border-t border-gray-700 pt-4">
                                        <p className="text-gray-400 text-sm mb-2">Cover Image</p>
                                        {selectedImage ? (
                                            <div className="flex items-center gap-3 text-green-400">
                                                <ImageIcon size={16} /> 
                                                <span className="text-sm">New image selected: {selectedImage.name}</span>
                                            </div>
                                        ) : existingImageUrl ? (
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <ImageIcon size={16} /> 
                                                <span className="text-sm">Using existing image.</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 text-yellow-500">
                                                <ImageIcon size={16} /> 
                                                <span className="text-sm">No image selected.</span>
                                            </div>
                                        )}
                                        
                                        {/* Preview ảnh nhỏ ở bước review nếu muốn */}
                                        {(previewUrl || existingImageUrl) && (
                                            <div className="mt-2">
                                                <img src={previewUrl || existingImageUrl} alt="Preview" className="h-16 w-28 object-cover rounded border border-slate-600" />
                                            </div>
                                        )}
                                    </div>

                                    {productData.instructions && (
                                        <div className="border-t border-gray-700 pt-4">
                                            <p className="text-gray-400 text-sm mb-1">Instructions</p>
                                            <p className="text-sm text-gray-300 whitespace-pre-line line-clamp-3">
                                                {productData.instructions}
                                            </p>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-700 my-4"></div>

                                    {/* Uploader Info */}
                                    <div>
                                        <h3 className="text-indigo-300 font-semibold mb-4 flex items-center">
                                            <User className="w-4 h-4 mr-2" /> Uploader Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 uppercase">Full Name</label>
                                                <div className="bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-700 text-gray-300 mt-1">
                                                    {user?.user_metadata?.full_name || "Unknown"}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 uppercase">Email</label>
                                                <div className="bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-700 text-gray-300 mt-1">
                                                    {user?.email || "Unknown"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-700/50">
                            {message && <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-semibold flex items-center ${isSuccess ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-red-900/30 text-red-400 border border-red-800"}`}>{message}</div>}

                            <div className="flex justify-between items-center">
                                {currentStep > 1 && !isSuccess ? (<button onClick={handlePrevious} className="flex items-center px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>) : (<div></div>)}

                                {currentStep < 3 ? (
                                    <button onClick={handleNext} className="flex items-center px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition">Next Step <ArrowRight className="w-4 h-4 ml-2" /></button>
                                ) : (
                                    <>
                                        {isSuccess ? (
                                            <Link to={backLink} className="flex items-center px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition">
                                                <ArrowLeft className="w-4 h-4 mr-2" /> {backText}
                                            </Link>
                                        ) : (
                                            <button onClick={handleFinalSubmit} disabled={loading} className={`flex items-center px-8 py-3 rounded-xl font-bold text-white shadow-lg transition ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 shadow-green-600/20"}`}>{loading ? 'Processing...' : (isEditMode ? 'Save Changes' : 'Submit Product')}</button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default NewProduct;