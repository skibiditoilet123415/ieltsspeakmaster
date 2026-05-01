import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  Sparkles,
  BookOpen,
  Brain,
  Target,
  CheckCircle2,
  ArrowRight,
  Star,
  Quote,
  Users,
  Trophy,
  Award,
  TrendingUp,
  Heart,
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
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Trophy className="h-4 w-4" /> Hall of Fame
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">Vinh danh học viên xuất sắc</h2>
          <p className="text-sm text-muted-foreground mt-1">Học viên đạt band cao nhất tháng này</p>
        </div>
        <div className="hidden sm:block text-right text-xs text-muted-foreground">
          <div className="font-mono">No. 01</div>
          <div className="font-mono">/ 2026</div>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-elegant">
        <div className="grid md:grid-cols-5">
          {/* Left: portrait block */}
          <div className="md:col-span-2 relative bg-gradient-hero p-8 flex flex-col justify-between min-h-[280px]">
            <div className="absolute top-4 right-4 text-primary-foreground/40 text-[10px] font-mono tracking-widest">
              IELTS · 2026
            </div>
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-white/15 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-5xl font-black text-white shadow-glow">
                NG
              </div>
              <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-yellow-900" />
              </div>
            </div>
            <div className="text-primary-foreground">
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">Top Student</div>
              <div className="text-2xl font-extrabold leading-tight mt-1">Nguyễn Trần<br/>Ngân Giang</div>
            </div>
          </div>

          {/* Right: quote + scores */}
          <div className="md:col-span-3 p-8 bg-card flex flex-col justify-between">
            <div>
              <Quote className="h-8 w-8 text-primary/20" />
              <p className="text-base sm:text-lg leading-relaxed mt-2 font-medium">
                Em thấy rất hài lòng với phương pháp luyện nói của IELTS Speaking Master.
                AI chấm điểm rất chi tiết, giúp em biết mình yếu ở đâu để cải thiện.
                <span className="text-primary"> Em đã đạt được band điểm mơ ước!</span>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-dashed">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Overall Band</div>
                  <div className="text-5xl font-black bg-gradient-primary bg-clip-text text-transparent">8.0</div>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { l: "Fluency", v: "8.5" },
                    { l: "Lexical", v: "8.0" },
                    { l: "Grammar", v: "7.5" },
                    { l: "Pron.", v: "8.0" },
                  ].map((s) => (
                    <div key={s.l} className="px-2">
                      <div className="text-lg font-bold">{s.v}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.l}</div>
                    </div>
                  ))}
                </div>
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

  return (
    <section className="mt-16">
      <div className="grid lg:grid-cols-3 gap-6 items-center">
        {/* Left: stat hero */}
        <div className="lg:col-span-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <TrendingUp className="h-4 w-4" /> Cộng đồng
          </div>
          <div className="mt-3 flex items-baseline gap-2 justify-center lg:justify-start">
            <span className="text-5xl sm:text-6xl font-black bg-gradient-primary bg-clip-text text-transparent">100K+</span>
          </div>
          <h3 className="text-lg font-bold mt-2">học viên đã tin tưởng</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Đã đạt band điểm mơ ước cùng IELTS Speaking Master qua các khoá luyện nói cá nhân hoá.
          </p>
          <div className="mt-4 flex items-center gap-3 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {["bg-rose-400","bg-amber-400","bg-emerald-400","bg-sky-400"].map((c,i)=>(
                <div key={i} className={`h-7 w-7 rounded-full ${c} border-2 border-background`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">+ nhiều học viên khác</span>
          </div>
        </div>

        {/* Right: avatar collage */}
        <div className="lg:col-span-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {students.map((s, i) => {
            // alternating rounded shapes for variety
            const shape = i % 3 === 0 ? "rounded-full" : i % 3 === 1 ? "rounded-2xl" : "rounded-[28%]";
            const tones = [
              "bg-primary text-primary-foreground",
              "bg-accent text-accent-foreground",
              "bg-secondary text-secondary-foreground",
              "bg-gradient-primary text-primary-foreground",
            ];
            const tone = tones[i % tones.length];
            const offset = i % 2 === 0 ? "" : "translate-y-3";
            return (
              <div key={s.name} className={`group relative ${offset}`}>
                <div className={`aspect-square ${shape} ${tone} flex items-center justify-center font-bold text-base shadow-soft hover:shadow-elegant hover:scale-105 transition-all`}>
                  {initials(s.name)}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md bg-background border text-[9px] font-bold text-primary shadow-soft whitespace-nowrap">
                  {s.band.toFixed(1)}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-foreground text-background text-[10px] whitespace-nowrap z-10">
                  {s.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Phan Lệ Quỳnh Nhi", text: "Luyện thi với AI giúp em tự tin hơn rất nhiều. Câu hỏi sát đề thi thật, phản hồi nhanh và rất chi tiết.", band: "7.5" },
    { name: "Lê Thị Hương", text: "Em chuẩn bị thi IELTS chỉ trong 2 tháng. Nhờ luyện speaking mỗi ngày trên app mà em đã đạt 7.5 overall!", band: "7.5" },
    { name: "Trần Thảo Giang", text: "Em không biết bắt đầu từ đâu, app gợi ý lộ trình rõ ràng. Em đặc biệt thích phần từ vựng theo chủ đề.", band: "7.0" },
    { name: "Võ Thị Mỹ Hương", text: "Đã từng học ở nhiều trung tâm nhưng app này cho em sự linh hoạt và phản hồi cá nhân hoá tốt nhất.", band: "8.0" },
    { name: "Đặng Quốc Bảo", text: "Phần chấm điểm rất công bằng. Em thấy được điểm yếu trong grammar và đã cải thiện rõ rệt sau 3 tuần.", band: "7.5" },
    { name: "Hoàng Khánh Linh", text: "Giao diện đẹp, dễ dùng, luyện mọi lúc mọi nơi. Em đã từ band 6.0 lên 7.5 chỉ sau 6 tuần.", band: "7.5" },
  ];
  const initials = (n: string) => n.split(" ").slice(-2).map((w) => w[0]).join("");
  const accents = ["border-l-primary", "border-l-pink-500", "border-l-emerald-500", "border-l-amber-500", "border-l-violet-500", "border-l-sky-500"];

  return (
    <section className="mt-16">
      {/* Header band */}
      <div className="rounded-3xl bg-foreground text-background p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Heart className="h-48 w-48" />
        </div>
        <div className="relative grid sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-70">
              <Award className="h-4 w-4" /> Học viên nói gì
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mt-2">
              Được đánh giá cao bởi hàng trăm nghìn học viên đã và đang theo học
            </h2>
            <p className="text-sm opacity-75 mt-3 max-w-xl">
              Đội ngũ AI của IELTS Speaking Master luôn lắng nghe phản hồi để hoàn thiện trải nghiệm,
              giúp bạn đạt mục tiêu band điểm một cách hiệu quả nhất.
            </p>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-6xl font-black">4.9</div>
            <div className="flex items-center gap-0.5 justify-center sm:justify-end mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
            <div className="text-xs opacity-70 mt-1">trên 5 sao</div>
          </div>
        </div>
      </div>

      {/* Reviews bento */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((r, i) => (
          <Card
            key={r.name}
            className={`p-5 border-l-4 ${accents[i % accents.length]} shadow-soft hover:shadow-elegant transition-all hover:-translate-y-0.5`}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                {initials(r.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm truncate">{r.name}</div>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                    {r.band}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mt-3 text-muted-foreground">
              "{r.text}"
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
