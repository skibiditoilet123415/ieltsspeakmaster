// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { word } = await req.json();
    const term = String(word || "").trim().slice(0, 80);
    if (!term) {
      return new Response(JSON.stringify({ error: "Missing word" }), {
        status: 400, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) {
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 503, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const sys = `You are a Cambridge-style English dictionary. For the given word or short phrase, return ONLY strict JSON with keys:
{
  "word": string (the headword, lowercased unless proper noun),
  "pronunciation": string (IPA in British style with slashes, e.g. /əˈbændən/),
  "cefr_level": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "meaning_en": string (one concise definition, <= 22 words),
  "meaning_vi": string (Vietnamese translation/definition, <= 22 words),
  "example": string (one natural example sentence using the word)
}
No prose, no markdown, no code fences.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: term },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("[define-word] gateway", r.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 502, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const j = await r.json();
    const content = j?.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }

    return new Response(JSON.stringify({
      word: parsed.word || term,
      pronunciation: parsed.pronunciation || "",
      cefr_level: parsed.cefr_level || "",
      meaning_en: parsed.meaning_en || "",
      meaning_vi: parsed.meaning_vi || "",
      example: parsed.example || "",
    }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[define-word]", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
