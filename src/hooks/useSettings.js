import { useState, useEffect, useRef } from "react";
import { supabase } from "../routes/supabaseClient";

export const useSettings = (user) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    avatar_url: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const uploadTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name || "",
        bio: user.user_metadata?.bio || "",
        email: user.email || prev.email || "",
        avatar_url: user.user_metadata?.avatar_url || prev.avatar_url || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (successMessage || passwordError) {
        setSuccessMessage("");
        setPasswordError("");
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [successMessage, passwordError]);

  const handleUploadAvatar = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
    uploadTimeoutRef.current = setTimeout(() => setUploading(false), 15000);

    try {
      setUploading(true);
      setSuccessMessage("");

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setUploading(false);
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);

      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      setSuccessMessage("Avatar updated successfully!");

      (async () => {
        try {
          const { data: authData, error: authError } = await supabase.auth.updateUser({
            data: {
              avatar_url: publicUrl,
              avatar_updated_at: new Date().toISOString(),
            },
          });
          if (authError) console.error("Auth update failed:", authError);
          else if (authData?.user) setCurrentUser(authData.user);

          const { error: syncError } = await supabase.from("profiles").upsert({
            id: currentUser.id,
            avatar_url: publicUrl,
            full_name: formData.name || currentUser.user_metadata?.full_name,
            updated_at: new Date().toISOString(),
          }, { onConflict: "id" });
          if (syncError) console.error("Profile sync failed:", syncError);

          window.dispatchEvent(new CustomEvent("hyperx-avatar-updated", {
            detail: { userId: currentUser.id, avatarUrl: publicUrl },
          }));

          supabase.auth.refreshSession().catch((err) =>
            console.warn("Background refreshSession failed:", err)
          );
        } catch (bgErr) {
          console.error("Background update error:", bgErr);
        }
      })();

    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message || "Network error"}`);
    } finally {
      setUploading(false);
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
    }
  };

  const handleSaveName = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (formData.name === currentUser.user_metadata?.full_name) {
      setIsEditingName(false);
      setSuccessMessage("");
      return;
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: { 
        full_name: formData.name,
        bio: formData.bio 
      },
    });

    if (!authError) {
      await supabase.from("profiles").upsert({
        id: currentUser.id,
        full_name: formData.name,
        bio: formData.bio,
      });

      setIsEditingName(false);
      setSuccessMessage("Profile updated successfully.");
      await supabase.auth.refreshSession();
      setCurrentUser((prev) => ({
        ...prev,
        user_metadata: { ...prev.user_metadata, full_name: formData.name },
      }));
    } else {
      console.error("Name update failed:", authError.message);
      alert("Error updating name: " + authError.message);
    }
  };

  const handleSavePassword = async (e) => {
    e.stopPropagation();
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Secret match failed. Passwords do not correlate.");
      return;
    }
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: formData.currentPassword,
      });
      if (signInError) {
        setPasswordError("Verification failed. Current password incorrect.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });
      if (updateError) {
        setPasswordError("Vault update failed.");
      } else {
        setSuccessMessage("Vault credentials updated successfully!");
        setIsEditingPassword(false);
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordError("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    state: {
      currentUser,
      formData,
      isEditingName,
      successMessage,
      isEditingPassword,
      passwordError,
      uploading,
    },
    refs: {
      fileInputRef,
    },
    actions: {
      setFormData,
      setIsEditingName,
      setSuccessMessage,
      setIsEditingPassword,
      setPasswordError,
      handleUploadAvatar,
      handleSaveName,
      handleSavePassword,
    },
  };
};
