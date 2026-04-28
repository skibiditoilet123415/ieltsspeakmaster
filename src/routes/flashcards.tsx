import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/flashcards")({
  component: () => (
    <RequireAuth>
      <Flashcards />
    </RequireAuth>
  ),
});

// Leitner box intervals (days)
const INTERVALS = [0, 1, 2, 4, 7, 14];

function Flashcards() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [cards, setCards] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("vocabulary")
      .select("*")
      .eq("user_id", user.id)
      .lte("next_review", new Date().toISOString())
      .order("next_review", { ascending: true })
      .limit(20)
      .then(({ data }) => { setCards(data || []); setLoading(false); });
  }, [user]);

  const current = cards[idx];

  const review = async (known: boolean) => {
    if (!current || !user) return;
    const newBox = known ? Math.min(5, current.box + 1) : 1;
    const days = INTERVALS[newBox];
    const next = new Date(Date.now() + days * 86400000).toISOString();
    await supabase.from("vocabulary").update({
      box: newBox,
      next_review: next,
      times_seen: (current.times_seen || 0) + 1,
      times_known: (current.times_known || 0) + (known ? 1 : 0),
    }).eq("id", current.id);
    await supabase.from("flashcard_reviews").insert({
      user_id: user.id,
      vocabulary_id: current.id,
      result: known ? "know" : "dont_know",
    });
    setFlipped(false);
    setIdx((i) => i + 1);
  };

  if (loading) return <AppShell><p className="text-muted-foreground">{t("common.loading")}</p></AppShell>;

  if (!current) {
    return <AppShell><Card className="p-8 text-center">{t("vocab.done")}</Card></AppShell>;
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
        <span>{idx + 1} / {cards.length}</span>
        <span>{t("vocab.flip")}</span>
      </div>

      <div className="flip-card h-72 mb-6" onClick={() => setFlipped((f) => !f)}>
        <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
          <Card className="flip-face p-8 flex items-center justify-center bg-gradient-hero text-primary-foreground cursor-pointer shadow-elegant border-0">
            <div className="text-3xl font-bold text-center">{current.word}</div>
          </Card>
          <Card className="flip-face flip-back p-6 overflow-auto cursor-pointer shadow-elegant">
            <div className="text-xs uppercase text-muted-foreground">{t("vocab.meaning")}</div>
            <div className="font-semibold mb-2">{lang === "vi" ? current.meaning_vi || current.meaning_en : current.meaning_en}</div>
            {current.example && (<>
              <div className="text-xs uppercase text-muted-foreground mt-2">{t("vocab.example")}</div>
              <div className="italic text-sm">"{current.example}"</div>
            </>)}
            {current.tip && (<>
              <div className="text-xs uppercase text-muted-foreground mt-2">{t("vocab.tip")}</div>
              <div className="text-sm">{current.tip}</div>
            </>)}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => review(false)}>{t("vocab.dont")}</Button>
        <Button className="bg-gradient-primary" onClick={() => review(true)}>{t("vocab.know")}</Button>
      </div>
    </AppShell>
  );
}
