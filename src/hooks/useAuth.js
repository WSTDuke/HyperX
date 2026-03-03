import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../routes/supabaseClient";

export const useSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { email, password } = formData;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        let errorText = "Đã xảy ra lỗi.";
        if (error.message.includes("Invalid login credentials"))
          errorText = "Email hoặc mật khẩu sai.";
        else if (error.message.includes("Email not confirmed"))
          errorText = "Vui lòng xác thực email.";
        else errorText = error.message;
        setMessage({ type: "error", text: errorText });
        return;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setLoading(false);
        await supabase.auth.signOut();
        setTimeout(() => navigate("/verify"), 1500);
        return;
      }

      setLoading(false);
      setMessage({ type: "success", text: `Chào mừng trở lại!` });
      setLoggingIn(true);
      setTimeout(() => navigate("/community"), 800);
    } catch (e) {
      setLoading(false);
      setMessage({ type: "error", text: e.message });
    }
  };

  return {
    state: { formData, loading, loggingIn, message },
    actions: { handleChange, handleSubmit },
  };
};

export const useSignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    const trimmedEmail = formData.email.trim();
    const trimmedName = formData.name.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setMessage({ type: "error", text: "Invalid email format." });
      return;
    }

    setCheckingEmail(true);
    setMessage(null);

    try {
      const { data: status, error } = await supabase.rpc("check_email_status", {
        email_check: trimmedEmail,
      });

      if (error) {
        console.error("Supabase check error:", error);
        throw error;
      }

      if (status === "verified") {
        setMessage({
          type: "error",
          text: "This email is already registered. Please use a different email.",
        });
        setCheckingEmail(false);
        return;
      }

      if (status === "pending") {
        setMessage({
          type: "error",
          text: "This email is pending verification. Please check your inbox (including Spam).",
        });
        setCheckingEmail(false);
        return;
      }

      setCheckingEmail(false);
      setStep(2);
    } catch (error) {
      console.error("Error checking email availability:", error.message);
      setMessage({ type: "error", text: "Connection error. Please try again." });
      setCheckingEmail(false);
    }
  };

  const handlePrevStep = () => {
    setMessage(null);
    setStep(1);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const email = formData.email.trim();
    const name = formData.name.trim();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setLoading(false);
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    const passwordRules = [
      { id: 1, label: "At least 8 characters", test: (pw) => pw.length >= 8 },
      { id: 2, label: "At least 1 uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
      { id: 3, label: "At least 1 lowercase letter", test: (pw) => /[a-z]/.test(pw) },
      { id: 4, label: "At least 1 number", test: (pw) => /[0-9]/.test(pw) },
      { id: 5, label: "At least 1 special character (!@#$%^&*)", test: (pw) => /[!@#$%^&*]/.test(pw) },
    ];

    const isPasswordValid = passwordRules.every((rule) => rule.test(password));

    if (!isPasswordValid) {
      setLoading(false);
      setMessage({ type: "error", text: "Password does not meet security requirements." });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name || "New User",
            phone_number: "",
          },
        },
      });

      if (error) throw error;

      setLoading(false);
      navigate("/verify", {
        state: {
          email,
          message: "Please check your email to verify your account.",
        },
      });
    } catch (error) {
      console.error("Supabase sign up error:", error.message);
      setLoading(false);
      setMessage({ type: "error", text: "Registration failed. Please try again." });
    }
  };

  return {
    state: { step, formData, loading, checkingEmail, message },
    actions: { handleChange, handleNextStep, handlePrevStep, handleSignUp },
  };
};
