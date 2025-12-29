// File: netlify/functions/chat.mjs
export default async function handler(req, context) {
  // 1. Chỉ nhận method POST
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // 2. Lấy API Key từ cài đặt Netlify
    const apiKey = Netlify.env.get("GOOGLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API Key in Netlify" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Lấy dữ liệu từ Frontend
    const body = await req.json();
    const { message, image, history } = body;

    // 4. Cấu hình Model (Dùng tên phiên bản cụ thể để tránh lỗi 404)
    // Bạn có thể đổi thành "gemini-1.5-flash-8b" nếu muốn nhanh hơn nữa
    const MODEL_NAME = "gemini-1.5-flash"; 
    
    // Gọi trực tiếp API v1beta (Không qua SDK)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    // Chuẩn bị nội dung gửi đi
    const contents = [];

    // Map lịch sử chat
    if (history && Array.isArray(history)) {
      history.forEach(h => {
        const role = h.role === 'client' || h.role === 'user' ? 'user' : 'model';
        contents.push({ role, parts: h.parts });
      });
    }

    // Map tin nhắn hiện tại
    const currentParts = [];
    if (message) currentParts.push({ text: message });
    if (image) {
      currentParts.push({
        inline_data: { mime_type: "image/jpeg", data: image }
      });
    }
    contents.push({ role: "user", parts: currentParts });

    // 5. Thực hiện gọi API (FETCH)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        generationConfig: { temperature: 0.9, maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();

    // Xử lý lỗi từ Google
    if (!response.ok) {
      const errorMessage = data.error?.message || response.statusText;
      console.error("Google API Error:", errorMessage);
      return new Response(JSON.stringify({ error: `Google Error: ${errorMessage}` }), {
        status: 500, // Hoặc status tương ứng
        headers: { "Content-Type": "application/json" }
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 6. Trả kết quả về Frontend
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}