import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { BandRing } from "@/components/BandRing";
import { BandTrend } from "@/components/BandTrend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  History as HistoryIcon,
  Sparkles,
  Flame,
  Trophy,
  BookOpen,
  Brain,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IELTS Speaking Master — Practice with AI, Reach Band 7+" },
      {
        name: "description",
        content:
          "Practice IELTS Speaking with an AI examiner. Instant band scoring, smart vocabulary, spaced-repetition flashcards.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <AppShell>
      <Hero onStart={() => navigate({ to: user ? "/speaking" : "/auth" })} signedIn={!!user} t={t} />
      <Features t={t} />
      {user ? <SignedInPanel /> : <CallToAction onStart={() => navigate({ to: "/auth" })} t={t} />}
    </AppShell>
  );
}

function Hero({ onStart, signedIn, t }: { onStart: () => void; signedIn: boolean; t: any }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-hero text-primary-foreground shadow-elegant px-6 py-16 sm:px-12 sm:py-24">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> AI-powered IELTS Examiner
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
          Master <span className="text-white/95">IELTS Speaking</span>
          <br />
          <span className="opacity-90">and reach Band 7+</span>
        </h1>
        <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
          Practice realistic Part 1, 2 & 3 questions with an AI examiner. Get instant band
          scores, fluency feedback, and a personalised vocabulary plan.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Button
            size="lg"
            className="rounded-full h-12 px-7 bg-white text-primary hover:bg-white/90 font-semibold shadow-soft"
            onClick={onStart}
          >
            <Mic className="h-5 w-5" /> {signedIn ? "Start Speaking" : "Get Started Free"}
          </Button>
          <Link to="/vocabulary">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-7 bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            >
              <BookOpen className="h-5 w-5" /> Explore Vocabulary
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 pt-4 text-xs opacity-90">
          <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> 200+ topics</span>
          <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Instant scoring</span>
          <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Free to start</span>
        </div>
      </div>
    </section>
  );
}

function Features({ t }: { t: any }) {
  const items = [
    {
      icon: Mic,
      title: "AI Examiner",
      desc: "Realistic Part 1, 2 & 3 simulations with adaptive follow-ups.",
    },
    {
      icon: Target,
      title: "Instant Band Score",
      desc: "Fluency, lexical resource, grammar & pronunciation feedback in seconds.",
    },
    {
      icon: BookOpen,
      title: "Smart Vocabulary",
      desc: "Save words from your sessions and review with spaced repetition.",
    },
    {
      icon: Brain,
      title: "Personalised Plan",
      desc: "Track your trend and follow targeted improvements toward your goal band.",
    },
  ];
  return (
    <section className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Everything you need to hit your target band</h2>
        <p className="text-muted-foreground mt-2 text-sm">A complete IELTS Speaking trainer powered by AI.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-5 shadow-soft hover:shadow-elegant transition-shadow">
            <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CallToAction({ onStart, t }: { onStart: () => void; t: any }) {
  return (
    <section className="mt-12">
      <Card className="p-8 sm:p-10 text-center shadow-elegant border-0 bg-gradient-primary text-primary-foreground">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to start practising?</h2>
        <p className="opacity-90 mt-2 text-sm sm:text-base">Create a free account and take your first AI mock test today.</p>
        <Button
          size="lg"
          className="mt-6 rounded-full h-12 px-8 bg-white text-primary hover:bg-white/90 font-semibold"
          onClick={onStart}
        >
          Get Started Free <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
    </section>
  );
}

function SignedInPanel() {
  const { user } = useAuth();
  const { t } = useI18n();
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

  const remaining = Math.max(0, 2 - usedToday);

  return (
    <section className="mt-12 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your progress</h2>
          <p className="text-sm text-muted-foreground">{premium ? "Unlimited daily tests" : `${remaining} free test${remaining === 1 ? "" : "s"} left today`}</p>
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
