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
  Star,
  Quote,
  Users,
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
      <TopStudent />
      <StudentsWall />
      <Testimonials />
      {!user && <CallToAction onStart={() => navigate({ to: "/auth" })} t={t} />}
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


function TopStudent() {
  return (
    <section className="mt-16">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Vinh danh học viên xuất sắc</h2>
        <p className="text-sm text-muted-foreground mt-1">Học viên đạt band cao nhất tháng này</p>
      </div>
      <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-primary text-primary-foreground border-0 shadow-elegant">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="h-28 w-28 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold shrink-0">
            NG
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs uppercase tracking-wider opacity-80">Học viên tiêu biểu</div>
            <div className="text-xl font-bold mt-1">Nguyễn Trần Ngân Giang</div>
            <p className="text-sm opacity-90 mt-2 leading-relaxed">
              "Em thấy rất hài lòng với phương pháp luyện nói của IELTS Speaking Master.
              AI chấm điểm rất chi tiết, giúp em biết mình yếu ở đâu để cải thiện. Em đã đạt được band điểm mơ ước!"
            </p>
            <div className="flex items-center gap-4 mt-4 justify-center sm:justify-start">
              <div className="text-3xl font-extrabold">8.0</div>
              <div className="grid grid-cols-4 gap-2 text-[11px]">
                <div className="text-center"><div className="opacity-75">Fluency</div><div className="font-bold">8.5</div></div>
                <div className="text-center"><div className="opacity-75">Lexical</div><div className="font-bold">8.0</div></div>
                <div className="text-center"><div className="opacity-75">Grammar</div><div className="font-bold">7.5</div></div>
                <div className="text-center"><div className="opacity-75">Pron.</div><div className="font-bold">8.0</div></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function StudentsWall() {
  const students = [
    { name: "Phạm Tường Nguyên", band: 8.5 },
    { name: "Đỗ Thuỳ Linh", band: 8.0 },
    { name: "Trần Quang Minh", band: 7.5 },
    { name: "Lê Bảo Ngọc", band: 8.0 },
    { name: "Nguyễn Thanh Đạt", band: 7.5 },
    { name: "Phan Hồng Nhung", band: 8.0 },
    { name: "Vũ Hà Anh", band: 7.5 },
    { name: "Hoàng Mai Phương", band: 8.5 },
    { name: "Bùi Khánh Vy", band: 7.5 },
    { name: "Đinh Hải Yến", band: 8.0 },
    { name: "Ngô Minh Thư", band: 7.5 },
    { name: "Trịnh Khả Hân", band: 8.0 },
  ];
  const initials = (n: string) => n.split(" ").slice(-2).map((w) => w[0]).join("");
  const palette = [
    "from-blue-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
    "from-cyan-500 to-sky-500",
  ];
  return (
    <section className="mt-12">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-primary font-bold text-2xl sm:text-3xl">
          <Users className="h-6 w-6" /> 100.000+ học viên
        </div>
        <p className="text-sm text-muted-foreground mt-1">đã đạt band điểm mơ ước cùng IELTS Speaking Master</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {students.map((s, i) => (
          <Card key={s.name} className="p-3 shadow-soft hover:shadow-elegant transition-shadow">
            <div className={`aspect-square rounded-lg bg-gradient-to-br ${palette[i % palette.length]} flex items-center justify-center text-white font-bold text-lg mb-2`}>
              {initials(s.name)}
            </div>
            <div className="text-xs font-medium truncate">{s.name}</div>
            <div className="inline-block mt-1 text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              {s.band.toFixed(1)} OVERALL
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Phan Lệ Quỳnh Nhi", text: "Luyện thi với AI giúp em tự tin hơn rất nhiều. Câu hỏi sát đề thi thật, phản hồi nhanh và rất chi tiết." },
    { name: "Lê Thị Hương", text: "Em chuẩn bị thi IELTS chỉ trong 2 tháng. Nhờ luyện speaking mỗi ngày trên app mà em đã đạt 7.5 overall!" },
    { name: "Trần Thảo Giang", text: "Em không biết bắt đầu từ đâu, app gợi ý lộ trình rõ ràng. Em đặc biệt thích phần từ vựng theo chủ đề." },
    { name: "Võ Thị Mỹ Hương", text: "Đã từng học ở nhiều trung tâm nhưng app này cho em sự linh hoạt và phản hồi cá nhân hoá tốt nhất." },
    { name: "Đặng Quốc Bảo", text: "Phần chấm điểm rất công bằng. Em thấy được điểm yếu trong grammar và đã cải thiện rõ rệt sau 3 tuần." },
    { name: "Hoàng Khánh Linh", text: "Giao diện đẹp, dễ dùng, luyện mọi lúc mọi nơi. Em đã từ band 6.0 lên 7.5 chỉ sau 6 tuần." },
  ];
  return (
    <section className="mt-16">
      <Card className="p-6 sm:p-10 bg-gradient-primary text-primary-foreground border-0 shadow-elegant">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Được đánh giá cao bởi hàng trăm nghìn học viên đã và đang theo học
            </h2>
            <p className="text-sm opacity-90 mt-3 leading-relaxed">
              Đội ngũ AI của IELTS Speaking Master luôn lắng nghe phản hồi để hoàn thiện trải nghiệm,
              giúp bạn đạt mục tiêu band điểm một cách hiệu quả nhất.
            </p>
            <div className="flex items-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-300 text-yellow-300" />
              ))}
              <span className="ml-2 text-sm font-semibold">4.9 / 5</span>
            </div>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
            {reviews.map((r) => (
              <div key={r.name} className="bg-background text-foreground rounded-xl p-4 shadow-soft">
                <Quote className="h-4 w-4 text-primary mb-2" />
                <p className="text-sm leading-relaxed">{r.text}</p>
                <div className="text-xs font-semibold mt-3 text-primary">— {r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
