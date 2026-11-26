const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.use(express.json({ limit: "30kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/", rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  if (!API_KEY) return res.status(503).json({ error: "A IA ainda não foi configurada. Adicione GEMINI_API_KEY nas variáveis secretas do servidor." });
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
    return res.status(400).json({ error: "Envie uma conversa válida." });
  }
  const contents = messages.map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.text || "").slice(0, 5000) }]
  }));
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Você é Arcanos, uma assistente acolhedora e didática que ensina Tarot, Baralho Cigano/Lenormand, runas, I Ching e outras tradições oraculares. Explique símbolos, história, métodos de estudo e leituras de forma clara e respeitosa. Trate leituras como interpretações simbólicas para reflexão, nunca como previsões garantidas ou fatos. Não incentive decisões médicas, financeiras ou de segurança com base em oráculos. Não afirme possuir poderes sobrenaturais. Responda em português do Brasil, com organização e sem exagerar nos emojis." }] },
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 1200 }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini error:", data?.error?.message || response.status);
      return res.status(502).json({ error: "Não consegui consultar a IA agora. Verifique a configuração do servidor." });
    }
    const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
    if (!answer) return res.status(502).json({ error: "A IA não retornou uma resposta. Tente novamente." });
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao conversar com Arcanos." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`Arcanos online na porta ${PORT}`));
