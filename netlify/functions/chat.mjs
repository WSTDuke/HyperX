// File: netlify/functions/chat.mjs
export default async function handler(req, context) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const apiKey = Netlify.env.get("GOOGLE_API_KEY");
  if (!apiKey) return new Response(JSON.stringify({ error: "Chưa có API Key" }), { status: 500 });

  try {
    const body = await req.json();
    const { message, image, history } = body;

    const MODEL_NAME = "gemini-flash-latest";
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const contents = [];
    if (history) history.forEach(h => contents.push({ role: h.role === 'client' ? 'user' : 'model', parts: h.parts }));
    
    const currentParts = [];
    if (message) currentParts.push({ text: message });
    if (image) currentParts.push({ inline_data: { mime_type: "image/jpeg", data: image } });
    contents.push({ role: "user", parts: currentParts });

    // 2. Gọi API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        generationConfig: { temperature: 0.9, maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();

    // 3. XỬ LÝ LỖI THÔNG MINH
    if (!response.ok) {
      console.error("API Error:", data);

      // Nếu lỗi 404 (Không tìm thấy model), ta sẽ gọi API liệt kê danh sách model để xem Key này có gì
      if (response.status === 404 || data.error?.code === 404) {
        try {
          const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
          const listData = await listResp.json();
          const availableModels = listData.models?.map(m => m.name.replace('models/', '')) || [];
          
          return new Response(JSON.stringify({ 
            error: `Model '${MODEL_NAME}' không dùng được. Các model khả dụng của bạn là: ${availableModels.join(", ")}` 
          }), { status: 500 });
        } catch (e) {
            // Lỗi khi lấy danh sách
        }
      }

      throw new Error(data.error?.message || "Google API Error");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return new Response(JSON.stringify({ text }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}