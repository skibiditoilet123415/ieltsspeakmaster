import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { BandRing } from "@/components/BandRing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: () => (
    <RequireAuth>
      <History />
    </RequireAuth>
  ),
});

function History() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("speaking_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, [user]);

  if (active) {
    const f: any = active.feedback || {};
    return (
      <AppShell>
        <button onClick={() => setActive(null)} className="text-sm text-muted-foreground">← {t("history.back")}</button>
        <h1 className="text-xl font-bold my-3">{active.topic_title || t("history.detail")}</h1>
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-hero text-primary-foreground border-0 shadow-elegant text-center">
            <div className="text-xs uppercase opacity-80 mb-2">{t("speaking.overall")}</div>
            <BandRing band={Number(active.overall_band) || 0} size={120} />
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
                <div className="text-2xl font-bold text-primary">{Number(active[k] ?? 0).toFixed(1)}</div>
              </Card>
            ))}
          </div>
          {Array.isArray(f.mistakes) && f.mistakes.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">{t("speaking.mistakes")}</h3>
              <ul className="space-y-2 text-sm">
                {f.mistakes.slice(0, 5).map((m: any, i: number) => (
                  <li key={i} className="border-l-2 border-destructive pl-3">
                    <div className="text-muted-foreground line-through">{m.original}</div>
                    <div className="font-medium">{m.corrected}</div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {f.plan && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-1"><Sparkles className="h-4 w-4" /> {t("speaking.plan")}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{f.plan}</p>
            </Card>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link to="/" className="text-sm text-muted-foreground">← {t("common.back")}</Link>
      <h1 className="text-xl font-bold my-4">{t("history.title")}</h1>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("history.empty")}</p>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <Card key={s.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{s.topic_title || "Session"}</div>
                <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-primary">{s.overall_band ? Number(s.overall_band).toFixed(1) : "—"}</div>
                <Button size="sm" variant="outline" onClick={() => setActive(s)}>→</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
