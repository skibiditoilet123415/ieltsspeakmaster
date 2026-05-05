import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { Paywall } from "@/components/Paywall";
import { useIsPremium, freeTopicIds } from "@/lib/premium";
import { BookOpen, MessageCircle, Sparkles, Target, Mic, ChevronLeft, Lock, Play, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/topic/$topicId")({
  component: () => (
    <RequireAuth>
      <TopicLessons />
    </RequireAuth>
  ),
});

const KIND_META: Record<string, { icon: any; tint: string }> = {
  vocabulary: { icon: BookOpen, tint: "from-blue-500/20 to-blue-500/0" },
  sample: { icon: MessageCircle, tint: "from-purple-500/20 to-purple-500/0" },
  practice: { icon: Mic, tint: "from-emerald-500/20 to-emerald-500/0" },
  tips: { icon: Sparkles, tint: "from-amber-500/20 to-amber-500/0" },
  mock: { icon: Target, tint: "from-pink-500/20 to-pink-500/0" },
};

function TopicLessons() {
  const { topicId } = Route.useParams();
  const navigate = useNavigate();
  const { isPremium } = useIsPremium();
  const [topic, setTopic] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [locked, setLocked] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    (async () => {
      const [{ data: tp }, { data: ls }, { data: all }] = await Promise.all([
        supabase.from("topics").select("*").eq("id", topicId).maybeSingle(),
        supabase.from("topic_lessons").select("*").eq("topic_id", topicId).order("position"),
        supabase.from("topics").select("id,title,difficulty"),
      ]);
      setTopic(tp);
      setLessons(ls || []);
      const free = freeTopicIds(all || []);
      const isLocked = !isPremium && !free.has(topicId);
      setLocked(isLocked);
      if (isLocked) setPaywallOpen(true);
    })();
  }, [topicId, isPremium]);

  const startMock = () => {
    if (locked) { setPaywallOpen(true); return; }
    if (!topic) return;
    sessionStorage.setItem("pendingSpeakingTopic", JSON.stringify(topic));
    navigate({ to: "/speaking" });
  };

  const toggleDone = (pos: number) => {
    setDone((d) => {
      const n = new Set(d);
      n.has(pos) ? n.delete(pos) : n.add(pos);
      return n;
    });
  };

  if (!topic) {
    return (
      <AppShell>
        <div className="flex justify-center py-20 text-muted-foreground text-sm">Loading lesson…</div>
      </AppShell>
    );
  }

  const progress = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0;

  return (
    <AppShell>
      <Paywall open={paywallOpen} onOpenChange={setPaywallOpen} topicTitle={topic.title} />

      <Link to="/speaking" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ChevronLeft className="h-4 w-4" /> All topics
      </Link>

      <Card className="p-5 bg-gradient-hero text-primary-foreground border-0 shadow-elegant overflow-hidden relative">
        <div className="text-xs uppercase opacity-80 tracking-wider">{topic.category} · Band {topic.difficulty}</div>
        <h1 className="text-2xl font-bold mt-1">{topic.title}</h1>
        <p className="text-sm opacity-90 mt-1">5 structured lessons to master this topic.</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs opacity-90 mb-1">
            <span>Progress</span><span>{done.size}/{lessons.length}</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {locked && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-[10px] font-medium">
            <Lock className="h-3 w-3" /> Premium
          </div>
        )}
      </Card>

      <div className="space-y-3 mt-4">
        {lessons.map((l, i) => {
          const meta = KIND_META[l.kind] || KIND_META.tips;
          const Icon = meta.icon;
          const isDone = done.has(l.position);
          return (
            <Reveal key={l.id} delay={i * 60}>
              <Card
                className={`p-4 transition-all hover:-translate-y-0.5 hover:shadow-elegant ${locked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${meta.tint} flex items-center justify-center`}>
                    {locked ? <Lock className="h-5 w-5 text-muted-foreground" /> : <Icon className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">LESSON {l.position}</span>
                      <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{l.kind}</span>
                    </div>
                    <div className="font-semibold mt-0.5">{l.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{l.body}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {l.kind === "mock" ? (
                        <Button size="sm" className="bg-gradient-primary" onClick={startMock}>
                          <Play className="h-3.5 w-3.5" /> Start mock test
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant={isDone ? "secondary" : "outline"}
                          onClick={() => !locked && toggleDone(l.position)}
                          disabled={locked}
                        >
                          {isDone ? (<><CheckCircle2 className="h-3.5 w-3.5" /> Completed</>) : "Mark as done"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-6">
        <Button className="w-full bg-gradient-primary" onClick={startMock} disabled={locked}>
          <Mic className="h-4 w-4" /> {locked ? "Unlock to practice" : "Practice this topic now"}
        </Button>
      </div>
    </AppShell>
  );
}
