import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { BandRing } from "@/components/BandRing";
import { BandTrend } from "@/components/BandTrend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History as HistoryIcon, Flame, Trophy, Target } from "lucide-react";

export function ProgressPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avg, setAvg] = useState<number | null>(null);
  const [target, setTarget] = useState<number>(7);
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

  if (!user) return null;

  const remaining = Math.max(0, 2 - usedToday);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your progress</h2>
          <p className="text-sm text-muted-foreground">
            {premium ? "Unlimited daily tests" : `${remaining} free test${remaining === 1 ? "" : "s"} left today`}
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/history" })} variant="outline" size="sm" className="rounded-full">
          <HistoryIcon className="h-4 w-4" /> View history
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 shadow-soft flex items-center gap-4">
          <BandRing band={avg ?? 0} label="avg" />
          <div>
            <div className="text-xs text-muted-foreground">Average band</div>
            <div className="text-2xl font-bold">{avg ? avg.toFixed(1) : "—"}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Target className="h-3 w-3" /> Target: {target.toFixed(1)}
            </div>
          </div>
        </Card>
        <Card className="p-5 shadow-soft flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">XP</div>
            <div className="text-2xl font-bold">{xp}</div>
          </div>
        </Card>
        <Card className="p-5 shadow-soft flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Streak</div>
            <div className="text-2xl font-bold">{streak} days</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 shadow-soft lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">Band trend</h3>
          {trend.length >= 2 ? (
            <BandTrend points={trend} target={target} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">Complete a few tests to see your trend.</p>
          )}
        </Card>
        <Card className="p-5 shadow-soft">
          <h3 className="text-sm font-semibold mb-3">Recent sessions</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((s) => (
                <Link key={s.id} to="/history" className="block">
                  <div className="flex items-center justify-between rounded-lg p-2 hover:bg-accent/50 transition-colors">
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{s.topic_title || "Session"}</div>
                      <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-lg font-bold text-primary">{Number(s.overall_band).toFixed(1)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
