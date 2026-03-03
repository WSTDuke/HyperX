import React from "react";
import { Link, useParams } from "react-router-dom";
import { Package, Upload, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useProductUpload } from "../../../hooks/useProductUpload";
import { NotificationModal } from "../components/NotificationModal";
import { ProcessingModal } from "../components/ProcessingModal";
import { ProductFormInfo } from "../components/ProductFormInfo";
import { ProductAssetsUpload } from "../components/ProductAssetsUpload";
import { ProductReview } from "../components/ProductReview";

const NewProduct = ({ user }) => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { state, actions, constants } = useProductUpload({
    passingUser: user,
    id,
    isEditMode,
  });

  const {
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
  } = state;

  const {
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
  } = actions;

  const { KNOWN_OS, ACCEPT_ATTR } = constants;

  return (
    <div className="relative isolate min-h-screen bg-[#05050A] text-gray-300 font-sans pb-12 pt-24 overflow-hidden">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="fixed top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row tech-card border-white/5 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
          <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/40 p-8 flex flex-col justify-between">
            <div>
              <div className="mb-10">
                <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.3em] mb-2">Systems</p>
                <h2 className="text-2xl font-black text-white px-0 tracking-tighter uppercase glow-text-cyan">
                  {isEditMode ? "Edit Product" : "New Product"}
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { step: 1, icon: Package, label: "Information" },
                  { step: 2, icon: Upload, label: "Assets" },
                  { step: 3, icon: CheckCircle, label: "Review" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl font-black transition-all duration-500 group/step
                      ${
                        currentStep === item.step
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                          : currentStep > item.step
                            ? "text-green-500/70 border border-transparent hover:bg-green-500/5"
                            : "text-gray-600 border border-transparent"
                      }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${currentStep === item.step ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-white/5 text-current"}`}>
                      <item.icon size={16} strokeWidth={3} />
                    </div>
                    <span className="text-xs uppercase tracking-widest">{item.label}</span>
                    {currentStep > item.step && (
                      <CheckCircle size={14} className="ml-auto text-green-500 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/product"
              className="mt-8 block text-center px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/10 rounded-lg"
            >
              Cancel & Exit
            </Link>
          </aside>

          <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
            {currentStep === 1 && (
              <ProductFormInfo
                productName={productName}
                description={description}
                instructions={instructions}
                author={author}
                applicationType={applicationType}
                osTags={osTags}
                setProductName={setProductName}
                setDescription={setDescription}
                setInstructions={setInstructions}
                setAuthor={setAuthor}
                setApplicationType={setApplicationType}
                handleOSToggle={handleOSToggle}
                KNOWN_OS={KNOWN_OS}
              />
            )}

            {currentStep === 2 && (
              <ProductAssetsUpload
                osTags={osTags}
                filesByOS={filesByOS}
                existingDownloadLinks={existingDownloadLinks}
                uploadProgress={uploadProgress}
                handleFileChange={handleFileChange}
                previewUrl={previewUrl}
                existingImageUrl={existingImageUrl}
                handleImageChange={handleImageChange}
                imageProgress={imageProgress}
                ACCEPT_ATTR={ACCEPT_ATTR}
              />
            )}

            {currentStep === 3 && (
              <ProductReview
                productName={productName}
                applicationType={applicationType}
                author={author}
                osTags={osTags}
                filesByOS={filesByOS}
                existingDownloadLinks={existingDownloadLinks}
                previewUrl={previewUrl}
                existingImageUrl={existingImageUrl}
                isEditMode={isEditMode}
              />
            )}

            {message && (
              <div
                className={`mt-6 p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
                  isSuccess
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {isSuccess ? <CheckCircle size={18} /> : null}
                {message}
              </div>
            )}
          </main>
        </div>

        <div className="mt-6 flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-2xl tech-card">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors
              ${
                currentStep === 1 || loading
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-4">
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all
                  ${
                    loading
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                  }`}
              >
                {loading ? "Deploying..." : "Publish Product"}{" "}
                <Upload size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <NotificationModal
        message={modalMessage}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <ProcessingModal
        isVisible={loading}
        imageProgress={imageProgress}
        uploadProgress={uploadProgress}
        osTags={osTags}
        filesByOS={filesByOS}
        selectedImage={selectedImage}
      />
    </div>
  );
};

export default NewProduct;
