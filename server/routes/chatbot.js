import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const SYSTEM_PROMPT = `You are a medical assistant chatbot specialized in gynecology and general healthcare.

Response requirements (must follow):
- Keep responses neat, readable, and structured.
- Use markdown-style formatting with bold section titles.
- Use numbered lists for steps and bullet points for warning signs.
- Keep spacing between sections.
- Suggest the most relevant hospital department.
- Do NOT provide medical diagnosis.

Use this exact response structure whenever symptoms are shared:
**Summary**
A short one-line summary of what the user reported.

**Next Steps:**
1. Step one
2. Step two
3. Step three
4. Step four

**When to Seek Medical Advice:**
- Warning sign 1
- Warning sign 2
- Warning sign 3

**Which Department to Consult:**
- **General Physician** or appropriate department with one-line reason.

*This information is not a substitute for professional medical advice. Always consult a qualified healthcare provider.*`;

async function queryOpenRouter(message, apiKey) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.error?.message || "OpenRouter request failed");
  }

  const payload = await response.json();
  return payload?.choices?.[0]?.message?.content;
}

async function queryGemini(message, apiKey) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: message,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  return response.text;
}

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Chatbot API key is not configured",
        details: "Set GEMINI_API_KEY in server .env",
      });
    }

    const reply = apiKey.startsWith("sk-or-")
      ? await queryOpenRouter(message, apiKey)
      : await queryGemini(message, apiKey);

    if (!reply) {
      return res.status(502).json({
        error: "Chatbot service returned an empty response",
      });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return res.status(500).json({
      error: "An error occurred while communicating with the AI chatbot.",
      details: error.message,
    });
  }
});

export default router;
