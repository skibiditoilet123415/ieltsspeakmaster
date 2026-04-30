import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { BandRing } from "@/components/BandRing";
import { BandTrend } from "@/components/BandTrend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, History as HistoryIcon, Target, Sparkles, Flame, Trophy } from "lucide-react";

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
  const [trend, setTrend] = useState<{ date: string; band: number }[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [premium, setPremium] = useState<boolean>(false);
  const [usedToday, setUsedToday] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ data: profile }, { data: sessions }, { data: usage }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase
          .from("speaking_sessions")
          .select("id,topic_title,overall_band,created_at,status")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .order("created_at", { ascending: true })
          .limit(20),
        supabase.from("daily_usage").select("tests_count").eq("user_id", user.id).eq("day", today).maybeSingle(),
      ]);

      if (profile) {
        const p: any = profile;
        setTarget(Number(p.target_band) || 7);
        setName(p.display_name || user.email?.split("@")[0] || "");
        setXp(Number(p.xp) || 0);
        setStreak(Number(p.streak_days) || 0);
        setPremium(!!p.is_premium);
      }
      const completed = sessions || [];
      setTrend(
        completed
          .filter((s: any) => s.overall_band != null)
          .map((s: any) => ({ date: s.created_at, band: Number(s.overall_band) })),
      );
      setRecent([...completed].reverse().slice(0, 5));
      const bands = completed.map((s: any) => Number(s.overall_band)).filter((n: number) => !isNaN(n));
      if (bands.length) setAvg(bands.slice(-5).reduce((a: number, b: number) => a + b, 0) / Math.min(5, bands.length));
      setUsedToday(Number(usage?.tests_count) || 0);
    })();
  }, [user]);

  const remaining = Math.max(0, 2 - usedToday);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground">{t("dash.hi")}, 👋</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{name}</h1>
        </div>

      <div className="grid gap-6 lg:grid-cols-3">
       <div className="space-y-6 lg:col-span-2">
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
          <Card className="p-4 flex items-center gap-3 shadow-soft">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t("dash.xp")}</div>
              <div className="text-xl font-bold">{xp}</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 shadow-soft">
            <div className="h-10 w-10 rounded-lg bg-orange-500/15 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t("dash.streak")}</div>
              <div className="text-xl font-bold">{streak}</div>
            </div>
          </Card>
        </div>

        <Card className="p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">{t("dash.trend")}</h2>
            <div className="text-xs text-muted-foreground">{premium ? t("dash.daily_unlimited") : t("dash.daily_left", { n: remaining })}</div>
          </div>
          {trend.length >= 2 ? (
            <BandTrend points={trend} target={target} />
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">{t("dash.no_trend")}</p>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            className="h-auto py-4 flex-col gap-2 bg-gradient-primary shadow-soft"
            onClick={() => navigate({ to: "/speaking" })}
            disabled={!premium && remaining === 0}
          >
            <Mic className="h-5 w-5" />
            <span>{t("dash.start")}</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate({ to: "/history" })}>
            <HistoryIcon className="h-5 w-5" />
            <span>{t("dash.history")}</span>
          </Button>
        </div>
       </div>

       <div className="space-y-6">
        {!premium && (
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
        )}

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
      </div>
      </div>
    </AppShell>
  );
}

