import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/vocabulary")({
  component: () => (
    <RequireAuth>
      <Vocab />
    </RequireAuth>
  ),
});

function Vocab() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "due">("all");

  useEffect(() => {
    if (!user) return;
    let q = supabase.from("vocabulary").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (filter === "due") q = q.lte("next_review", new Date().toISOString());
    q.then(({ data }) => setItems(data || []));
  }, [user, filter]);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{t("vocab.title")}</h1>
        <Link to="/flashcards">
          <Button size="sm" className="bg-gradient-primary gap-1"><Layers className="h-4 w-4" />{t("vocab.flashcards")}</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>{t("vocab.filter_all")}</Button>
        <Button size="sm" variant={filter === "due" ? "default" : "outline"} onClick={() => setFilter("due")}>{t("vocab.filter_due")}</Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("vocab.empty")}</p>
      ) : (
        <div className="space-y-2">
          {items.map((v) => (
            <Card key={v.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{v.word}</div>
                <div className="text-xs text-muted-foreground">Band {v.difficulty}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {lang === "vi" ? v.meaning_vi || v.meaning_en : v.meaning_en}
              </div>
              {v.example && <div className="text-xs italic mt-1 opacity-80">"{v.example}"</div>}
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
