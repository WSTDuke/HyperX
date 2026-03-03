import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "../routes/supabaseClient";

const MAX_HISTORY_TURNS = 3;

const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const useChatbotAI = (user) => {
  const [messages, setMessages] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [abortCtrl, setAbortCtrl] = useState(null);
  const simIntervalRef = useRef(null);
  const isTypingRef = useRef(false);

  const showAlert = (text, type = "info", ms = 4000) => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), ms);
  };

  const handleCancelFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert("File size exceeds 5MB.", "error");
      return;
    }
    setSelectedFile(file);
    try {
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } catch {
      setPreviewUrl(null);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (abortCtrl)
      try {
        abortCtrl.abort();
      } catch {
        // ignore
      }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setIsTyping(false);
    setAbortCtrl(null);
    setMessages((prev) =>
      prev.map((m) =>
        m.isPlaceholder
          ? {
              ...m,
              isPlaceholder: false,
              isThinking: false,
              content: m.content || "Stopped.",
            }
          : m,
      ),
    );
    showAlert("Stopped.", "info", 2000);
  }, [abortCtrl]);

  const callGeminiApi = useCallback(
    async (userPrompt, chatHistory = [], imageFile = null, onChunk = null) => {
      setAlert(null);

      let imageBase64 = null;
      if (imageFile) {
        try {
          const base64Full = await convertToBase64(imageFile);
          imageBase64 = base64Full.split(",")[1];
        } catch (err) {
          console.error("Image convert error:", err);
        }
      }

      let accumulated = "";
      const controller = new AbortController();
      setAbortCtrl(controller);

      try {
        const response = await fetch("/.netlify/functions/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userPrompt,
            image: imageBase64,
            history: chatHistory,
          }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP Error: ${response.status}`);
        }

        accumulated = data.text || "";

        if (onChunk && accumulated) {
          const revealSpeed = 10;
          let i = 0;
          await new Promise((resolve) => {
            simIntervalRef.current = setInterval(() => {
              i += 5;
              if (i > accumulated.length) i = accumulated.length;

              onChunk(accumulated.slice(0, i));

              if (i >= accumulated.length) {
                clearInterval(simIntervalRef.current);
                simIntervalRef.current = null;
                resolve();
              }
            }, revealSpeed);
          });
        }
      } catch (err) {
        if (err.name === "AbortError") return { responseText: accumulated };
        console.error("API Error:", err);
        throw err;
      } finally {
        setAbortCtrl(null);
        if (simIntervalRef.current) {
          clearInterval(simIntervalRef.current);
          simIntervalRef.current = null;
        }
      }

      return { responseText: accumulated };
    },
    [],
  );

  const handleSendMessage = useCallback(
    async (e, onScroll) => {
      if (e && e.preventDefault) e.preventDefault();
      const prompt = (input || "").trim();
      if (!prompt && !selectedFile) return;
      if (isTyping) return;

      setIsMenuOpen(false);
      const now = Date.now();
      if (!isChatStarted) setIsChatStarted(true);

      const fileToSend = selectedFile;
      const urlToShow = previewUrl;
      setInput("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsTyping(true);
      setAlert(null);

      const userMsg = {
        id: now,
        role: "user",
        content:
          prompt || (fileToSend ? `[Analyze file: ${fileToSend.name}]` : ""),
        imageUrl: urlToShow || null,
      };
      const botPlaceholderId = now + 1;
      const botPlaceholder = {
        id: botPlaceholderId,
        role: "assistant",
        content: "",
        isPlaceholder: true,
        isThinking: true,
      };

      setMessages((prev) => [...prev, userMsg, botPlaceholder]);

      const chatHistory = messages
        .filter((m) => !m.isPlaceholder)
        .slice(-MAX_HISTORY_TURNS * 2)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content || "" }],
        }));

      const onChunk = (acc) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === botPlaceholderId) {
              return { ...m, content: acc, isThinking: false };
            }
            return m;
          }),
        );
        if (onScroll) onScroll();
      };

      try {
        const { responseText } = await callGeminiApi(
          prompt || "",
          chatHistory,
          fileToSend,
          onChunk,
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botPlaceholderId
              ? {
                  ...m,
                  content: responseText,
                  isPlaceholder: false,
                  isThinking: false,
                }
              : m,
          ),
        );
      } catch (error) {
        console.error("API Call Error:", error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botPlaceholderId
              ? {
                  ...m,
                  content: `**Error:** ${error.message || "Something went wrong."}`,
                  isPlaceholder: false,
                  isThinking: false,
                }
              : m,
          ),
        );
        showAlert(`Error: ${error.message}`, "error");
      } finally {
        setIsTyping(false);
      }
    },
    [
      input,
      selectedFile,
      isTyping,
      isChatStarted,
      previewUrl,
      messages,
      callGeminiApi,
    ],
  );

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsProfileLoading(true);
      if (user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, email")
          .eq("id", user.id)
          .single();
        if (error) setUserProfile(user);
        else
          setUserProfile({
            ...user,
            full_name: data.full_name || user.full_name,
            avatar_url: data.avatar_url || user.avatar_url,
            email: data.email || user.email,
          });
      } else setUserProfile(null);
      setIsProfileLoading(false);
    };
    fetchUserProfile();
  }, [user?.id, user]);

  return {
    state: {
      messages,
      isChatStarted,
      input,
      isTyping,
      userProfile,
      alert,
      selectedFile,
      previewUrl,
      isMenuOpen,
      isProfileLoading,
    },
    refs: {
      isTypingRef,
    },
    actions: {
      setInput,
      setIsMenuOpen,
      handleCancelFile,
      handleFileSelect,
      handleStop,
      handleSendMessage,
    }
  };
};
