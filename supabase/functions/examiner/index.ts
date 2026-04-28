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
    const { topic, messages } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY not set");

    const candidateTurns = messages.filter((m: any) => m.role === "candidate").length;
    // rough part progression: 0-3 candidate turns = Part 1, 4 = Part 2 cue, 5+ = Part 3
    let part = "part1";
    if (candidateTurns >= 5) part = "part3";
    else if (candidateTurns === 4) part = "part2";

    const system = `You are a professional IELTS Speaking examiner.
Topic: "${topic?.title ?? "general"}" (category: ${topic?.category ?? "general"}).
Current stage: ${part.toUpperCase()}.
Rules:
- Speak like a real IELTS examiner: concise, natural, polite.
- Part 1: ask short personal questions (one at a time).
- Part 2: give the cue card prompt and say "You have 1 minute to prepare, then speak for 1-2 minutes".
- Part 3: ask abstract discussion questions.
- Do NOT give feedback during the test. No corrections, no scoring, no praise beyond a short acknowledgement.
- Respond with ONE examiner turn only (1-2 sentences).`;

    const chat = messages.map((m: any) => ({
      role: m.role === "examiner" ? "assistant" : "user",
      content: m.content,
    }));

    if (part === "part2" && candidateTurns === 4) {
      const cue = topic?.part2_cue;
      if (cue?.prompt) {
        const text = `${cue.prompt}\nYou should say:\n- ${(cue.points || []).join("\n- ")}\nYou have 1 minute to prepare, then speak for 1-2 minutes.`;
        return Response.json({ reply: text, part }, { headers: cors });
      }
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...chat],
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return new Response(JSON.stringify({ error: t }), { status: res.status, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Thank you. Could you tell me more?";
    return Response.json({ reply, part }, { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
