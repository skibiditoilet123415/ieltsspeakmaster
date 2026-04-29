import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { BandRing } from "@/components/BandRing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createSTT, speak, stopSpeaking } from "@/lib/voice";
import { Mic, Square, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/speaking")({
  component: () => (
    <RequireAuth>
      <Speaking />
    </RequireAuth>
  ),
});

type Msg = { role: "examiner" | "candidate"; content: string; part?: string };

function Speaking() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [xpAwarded, setXpAwarded] = useState<{ amount: number; words: string[] } | null>(null);
  const [knownVocab, setKnownVocab] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const sttRef = useRef<ReturnType<typeof createSTT> | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("topics").select("*").order("difficulty", { ascending: true }).then(({ data }) => setTopics(data || []));
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("vocabulary").select("word").eq("user_id", user.id).then(({ data }) => {
      setKnownVocab((data || []).map((r: any) => String(r.word).toLowerCase()));
    });
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const startWithTopic = async (tp: any) => {
    // Free-tier daily limit check (server-enforced)
    const { data: chk, error } = await supabase.rpc("consume_daily_test");
    if (error) { toast.error(error.message); return; }
    const c: any = chk;
    if (c && c.allowed === false) {
      if (c.reason === "limit") toast.error(t("speaking.limit"));
      else toast.error(t("common.error"));
      return;
    }
    setTopic(tp);
    const first = `Hello, I'm your IELTS examiner. Today's topic is "${tp.title}". Let's begin with Part 1. ${tp.part1_questions?.[0] || ""}`;
    setMessages([{ role: "examiner", content: first, part: "part1" }]);
    speak(first);
  };

  const toggleMic = () => {
    if (listening) {
      sttRef.current?.stop();
      setListening(false);
      return;
    }
    if (!sttRef.current) {
      sttRef.current = createSTT(
        (live) => setInput(live),
        (final) => {
          setListening(false);
          if (final) setInput(final);
        },
      );
    }
    if (!sttRef.current.supported) {
      toast.error("Voice input isn't supported in this browser. You can type your answer.");
      return;
    }
    stopSpeaking();
    setListening(true);
    sttRef.current.start();
  };

  const sendAnswer = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    if (listening) { sttRef.current?.stop(); setListening(false); }
    const next: Msg[] = [...messages, { role: "candidate", content: text }];
    setMessages(next);
    setThinking(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/examiner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ topic, messages: next }),
      });
      if (!res.ok) throw new Error(`Examiner error: ${res.status}`);
      const data = await res.json();
      const reply = data.reply || "Thank you. Can you tell me more?";
      setMessages([...next, { role: "examiner", content: reply, part: data.part }]);
      speak(reply);
    } catch (e: any) {
      toast.error(e.message || t("common.error"));
    } finally {
      setThinking(false);
    }
  };

  const finish = async () => {
    if (scoring) return;
    setScoring(true);
    stopSpeaking();
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ topic, messages }),
      });
      if (!res.ok) throw new Error(`Score error: ${res.status}`);
      const data = await res.json();
      setResult(data);

      // Save session
      if (user) {
        const { data: session } = await supabase
          .from("speaking_sessions")
          .insert({
            user_id: user.id,
            topic_id: topic?.id ?? null,
            topic_title: topic?.title ?? null,
            overall_band: data.overall_band,
            fluency_band: data.fluency_band,
            vocabulary_band: data.vocabulary_band,
            grammar_band: data.grammar_band,
            pronunciation_band: data.pronunciation_band,
            feedback: data,
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        // Save vocabulary
        if (session && Array.isArray(data.vocabulary)) {
          const rows = data.vocabulary.slice(0, 10).map((v: any) => ({
            user_id: user.id,
            session_id: session.id,
            word: v.word,
            meaning_en: v.meaning_en,
            meaning_vi: v.meaning_vi,
            example: v.example,
            synonyms: v.synonyms || [],
            tip: v.tip,
            topic: topic?.category || null,
            difficulty: v.difficulty || 6,
            source: "ai",
          }));
          if (rows.length) {
            // upsert to avoid dupes via unique index
            await supabase.from("vocabulary").upsert(rows, { onConflict: "user_id,word", ignoreDuplicates: true } as any);
            toast.success(t("speaking.saved_vocab", { n: rows.length }));
          }
        }

        // XP rewards: +5 for finishing, +10 per learned vocab word actually used in the answers
        const candidateText = messages
          .filter((m) => m.role === "candidate")
          .map((m) => m.content.toLowerCase())
          .join(" \n ");
        const used = Array.from(
          new Set(
            knownVocab.filter((w) => {
              if (!w || w.length < 3) return false;
              const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
              return re.test(candidateText);
            }),
          ),
        ).slice(0, 10);
        const amount = 5 + used.length * 10;
        try {
          await supabase.rpc("award_xp", { amount });
        } catch {/* non-fatal */}
        if (used.length) setXpAwarded({ amount, words: used });
      }
    } catch (e: any) {
      toast.error(e.message || t("common.error"));
    } finally {
      setScoring(false);
    }
  };

  if (result) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-hero text-primary-foreground border-0 shadow-elegant text-center">
            <div className="text-xs uppercase opacity-80 mb-2">{t("speaking.overall")}</div>
            <BandRing band={Number(result.overall_band) || 0} size={120} />
          </Card>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["fluency_band", "speaking.fluency"],
              ["vocabulary_band", "speaking.vocabulary"],
              ["grammar_band", "speaking.grammar"],
              ["pronunciation_band", "speaking.pronunciation"],
            ].map(([k, label]) => (
              <Card key={k} className="p-4 text-center">
                <div className="text-xs text-muted-foreground">{t(label as any)}</div>
                <div className="text-2xl font-bold text-primary">{Number(result[k] ?? 0).toFixed(1)}</div>
              </Card>
            ))}
          </div>
          {result.mistakes?.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">{t("speaking.mistakes")}</h3>
              <ul className="space-y-2 text-sm">
                {result.mistakes.slice(0, 5).map((m: any, i: number) => (
                  <li key={i} className="border-l-2 border-destructive pl-3">
                    <div className="text-muted-foreground line-through">{m.original}</div>
                    <div className="font-medium">{m.corrected}</div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {result.plan && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-1"><Sparkles className="h-4 w-4" /> {t("speaking.plan")}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{result.plan}</p>
            </Card>
          )}
          {xpAwarded && (
            <Card className="p-4 bg-gradient-primary text-primary-foreground border-0 shadow-elegant">
              <div className="text-sm font-semibold">{t("speaking.xp_earned", { n: xpAwarded.amount })}</div>
              {xpAwarded.words.length > 0 && (
                <div className="text-xs opacity-90 mt-1">
                  {t("speaking.used_words", { words: xpAwarded.words.join(", ") })}
                </div>
              )}
            </Card>
          )}
          <Button className="w-full" onClick={() => navigate({ to: "/" })}>← Dashboard</Button>
          <Button variant="outline" className="w-full" onClick={() => navigate({ to: "/vocabulary" })}>
            {t("nav.vocab")} →
          </Button>
        </div>
      </AppShell>
    );
  }

  if (!topic) {
    return (
      <AppShell>
        <h1 className="text-xl font-bold mb-3">{t("speaking.pick_topic")}</h1>
        <div className="space-y-3 mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {["all", ...Array.from(new Set(topics.map((tp) => tp.category)))].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs border ${
                  category === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const pool = topics.filter((tp) => category === "all" || tp.category === category);
              if (!pool.length) return;
              startWithTopic(pool[Math.floor(Math.random() * pool.length)]);
            }}
          >
            🎲 {t("speaking.random")}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {topics
            .filter((tp) => (category === "all" || tp.category === category) && tp.title.toLowerCase().includes(search.toLowerCase()))
            .map((tp) => (
              <Card key={tp.id} className="p-4 cursor-pointer hover:shadow-elegant transition-shadow" onClick={() => startWithTopic(tp)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{tp.title}</div>
                    <div className="text-xs text-muted-foreground">{tp.category} · Band {tp.difficulty}</div>
                  </div>
                  <Mic className="h-4 w-4 text-primary" />
                </div>
              </Card>
            ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-muted-foreground">{topic.category}</div>
          <h1 className="font-bold">{topic.title}</h1>
        </div>
        <Button size="sm" variant="outline" onClick={finish} disabled={scoring || messages.length < 3}>
          {scoring ? t("speaking.scoring") : t("speaking.done")}
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "candidate" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-soft ${
              m.role === "candidate" ? "bg-gradient-primary text-primary-foreground" : "bg-card border border-border"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {thinking && <div className="text-xs text-muted-foreground">•••</div>}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-20 inset-x-0 px-4">
        <div className="mx-auto max-w-xl bg-card border border-border rounded-2xl p-2 flex items-end gap-2 shadow-elegant">
          <Textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? t("speaking.listening") : t("speaking.type")}
            className="resize-none border-0 focus-visible:ring-0 bg-transparent min-h-[40px]"
          />
          <Button size="icon" variant={listening ? "destructive" : "secondary"} onClick={toggleMic}>
            {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button size="icon" className="bg-gradient-primary" onClick={sendAnswer} disabled={!input.trim() || thinking}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
