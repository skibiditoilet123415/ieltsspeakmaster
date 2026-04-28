import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { BandRing } from "@/components/BandRing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, History as HistoryIcon, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
});

function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [avg, setAvg] = useState<number | null>(null);
  const [target, setTarget] = useState<number>(7);
  const [name, setName] = useState<string>("");
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (profile) {
        setTarget(Number(profile.target_band) || 7);
        setName(profile.display_name || user.email?.split("@")[0] || "");
      }
      const { data: sessions } = await supabase
        .from("speaking_sessions")
        .select("id,topic_title,overall_band,created_at,status")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecent(sessions || []);
      if (sessions && sessions.length) {
        const bands = sessions.map((s: any) => Number(s.overall_band)).filter((n) => !isNaN(n));
        if (bands.length) setAvg(bands.reduce((a, b) => a + b, 0) / bands.length);
      }
    })();
  }, [user]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground">{t("dash.hi")}, 👋</div>
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>

        <Card className="p-6 bg-gradient-hero text-primary-foreground shadow-elegant border-0">
          <div className="flex items-center gap-4">
            <BandRing band={avg ?? 0} label="avg" />
            <div className="flex-1">
              <div className="text-xs opacity-80">{t("dash.avg_band")}</div>
              <div className="text-3xl font-bold">{avg ? avg.toFixed(1) : "—"}</div>
              <div className="mt-2 flex items-center gap-1 text-xs opacity-90">
                <Target className="h-3 w-3" /> {t("dash.target_band")}: {target.toFixed(1)}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button className="h-auto py-4 flex-col gap-2 bg-gradient-primary shadow-soft" onClick={() => navigate({ to: "/speaking" })}>
            <Mic className="h-5 w-5" />
            <span>{t("dash.start")}</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate({ to: "/history" })}>
            <HistoryIcon className="h-5 w-5" />
            <span>{t("dash.history")}</span>
          </Button>
        </div>

        <Card className="p-4 flex items-center gap-3 shadow-soft">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{t("dash.upgrade")}</div>
            <div className="text-xs text-muted-foreground">{t("dash.upgrade_price")}</div>
          </div>
          <Button size="sm" variant="secondary">→</Button>
        </Card>

        <div>
          <h2 className="text-sm font-semibold mb-3">{t("dash.recent")}</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("dash.no_sessions")}</p>
          ) : (
            <div className="space-y-2">
              {recent.map((s) => (
                <Link key={s.id} to="/history" className="block">
                  <Card className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{s.topic_title || "Session"}</div>
                      <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-lg font-bold text-primary">{Number(s.overall_band).toFixed(1)}</div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
