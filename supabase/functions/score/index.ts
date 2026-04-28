// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCHEMA = {
  type: "object",
  properties: {
    overall_band: { type: "number" },
    fluency_band: { type: "number" },
    vocabulary_band: { type: "number" },
    grammar_band: { type: "number" },
    pronunciation_band: { type: "number" },
    mistakes: {
      type: "array",
      items: {
        type: "object",
        properties: { original: { type: "string" }, corrected: { type: "string" }, note: { type: "string" } },
        required: ["original", "corrected"],
      },
    },
    vocabulary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          word: { type: "string" },
          meaning_en: { type: "string" },
          meaning_vi: { type: "string" },
          example: { type: "string" },
          synonyms: { type: "array", items: { type: "string" } },
          tip: { type: "string" },
          difficulty: { type: "number" },
        },
        required: ["word", "meaning_en", "example"],
      },
    },
    plan: { type: "string" },
  },
  required: ["overall_band", "fluency_band", "vocabulary_band", "grammar_band", "pronunciation_band"],
};

async function callModel(model: string, prompt: string, key: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are an IELTS Speaking examiner. Return ONLY the tool call with detailed, honest scoring." },
        { role: "user", content: prompt },
      ],
      tools: [{ type: "function", function: { name: "score_ielts", description: "Score IELTS speaking performance", parameters: SCHEMA } }],
      tool_choice: { type: "function", function: { name: "score_ielts" } },
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  return args ? JSON.parse(args) : null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { topic, messages } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY not set");

    const transcript = messages.map((m: any) => `${m.role === "examiner" ? "Examiner" : "Candidate"}: ${m.content}`).join("\n");
    const prompt = `Topic: ${topic?.title ?? "general"}.
Transcript of an IELTS Speaking test below. Score each criterion 1-9 (you may use .5), list up to 5 concrete mistakes with corrections, and suggest 6-10 useful vocabulary words/phrases the candidate could have used (include English meaning, Vietnamese meaning, one example sentence, 2-3 synonyms, a short IELTS-specific usage tip, and a difficulty 4-9). Finally give a 3-4 sentence personalized improvement plan.
Transcript:
${transcript}`;

    // Run OpenAI + Gemini in parallel. Combine 70% OpenAI, 30% Gemini.
    const [o, g] = await Promise.allSettled([
      callModel("openai/gpt-5-mini", prompt, KEY),
      callModel("google/gemini-2.5-flash", prompt, KEY),
    ]);

    const openai = o.status === "fulfilled" ? o.value : null;
    const gemini = g.status === "fulfilled" ? g.value : null;
    const primary = openai || gemini;
    if (!primary) throw new Error("Both models failed");

    const blend = (a: number | undefined, b: number | undefined) => {
      if (a != null && b != null) return Number((a * 0.7 + b * 0.3).toFixed(1));
      return Number((a ?? b ?? 0).toFixed(1));
    };

    const result = {
      overall_band: blend(openai?.overall_band, gemini?.overall_band),
      fluency_band: blend(openai?.fluency_band, gemini?.fluency_band),
      vocabulary_band: blend(openai?.vocabulary_band, gemini?.vocabulary_band),
      grammar_band: blend(openai?.grammar_band, gemini?.grammar_band),
      pronunciation_band: blend(openai?.pronunciation_band, gemini?.pronunciation_band),
      mistakes: primary.mistakes || [],
      // Prefer Gemini for vocab suggestions (per spec)
      vocabulary: (gemini?.vocabulary || openai?.vocabulary || []).slice(0, 10),
      plan: primary.plan || "",
    };

    return Response.json(result, { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
