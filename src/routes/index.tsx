import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, CountUp, useTilt } from "@/components/Reveal";
import { ScrollProgress, useMagnetic, useParallax } from "@/components/ScrollProgress";
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
  Award,
  TrendingUp,
  Heart,
  Headphones,
  Waves,
  Zap,
  PlayCircle,
  Users,
  GraduationCap,
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
      <ScrollProgress />
      <Hero onStart={() => navigate({ to: user ? "/speaking" : "/auth" })} signedIn={!!user} t={t} />
      <Reveal><StatsBand /></Reveal>
      <Reveal direction="up"><Features t={t} /></Reveal>
      <Reveal direction="zoom"><TrendShowcase /></Reveal>
      <Reveal><Testimonials /></Reveal>
      {!user && <Reveal direction="zoom"><CallToAction onStart={() => navigate({ to: "/auth" })} t={t} /></Reveal>}
    </AppShell>
  );
}


function Hero({ onStart, signedIn, t }: { onStart: () => void; signedIn: boolean; t: any }) {
  return (
    <section className="relative mt-2">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* LEFT */}
        <div className="lg:col-span-7 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            AI Examiner đang trực tuyến
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Luyện nói IELTS <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-primary bg-clip-text text-transparent">
                chạm band 7+
              </span>
              <span className="absolute left-0 right-0 bottom-1 h-3 bg-primary/15 -z-0 rounded-sm" />
            </span>{" "}
            mỗi ngày.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
            Một giám khảo AI luôn sẵn sàng — chấm điểm tức thì cho Fluency, Lexical,
            Grammar và Pronunciation. Học theo lộ trình cá nhân hoá, mọi lúc, mọi nơi.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full h-12 px-7 bg-gradient-primary text-primary-foreground hover:opacity-95 font-semibold shadow-elegant"
              onClick={onStart}
            >
              <Mic className="h-5 w-5" /> {signedIn ? "Bắt đầu nói ngay" : "Dùng thử miễn phí"}
            </Button>
            <Link to="/vocabulary">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-7 border-2">
                <PlayCircle className="h-5 w-5" /> Xem cách hoạt động
              </Button>
            </Link>
          </div>

          <div className="mt-7 flex items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> 200+ chủ đề</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Chấm tức thì</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Miễn phí</span>
          </div>
        </div>

        {/* RIGHT: floating chat-mock card */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-6 bg-gradient-hero opacity-20 blur-3xl rounded-full animate-blob" aria-hidden />
          <div className="relative rounded-3xl bg-card border shadow-elegant p-5 rotate-1 hover-lift animate-float-slow">
            <div className="flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-2 font-semibold">
                <span className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Headphones className="h-4 w-4 text-primary-foreground" />
                </span>
                Speaking · Part 2
              </div>
              <span className="text-muted-foreground font-mono">02:14</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm">
                Describe a place where you like to relax. You should say where it is,
                how often you go there, and why you like it.
              </div>
              <div className="rounded-2xl rounded-tr-sm bg-gradient-primary text-primary-foreground px-4 py-3 text-sm ml-8 shadow-soft">
                I'd love to talk about a small café near my home in Hà Nội…
                <div className="mt-2 flex items-center gap-1 bar-eq">
                  {[3,5,8,6,9,7,4,8,6,5,7,9].map((h,i)=>(
                    <span
                      key={i}
                      style={{ height: `${h*2}px`, animationDelay: `${i*80}ms` }}
                      className="w-1 rounded bg-primary-foreground/70"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 pt-4 border-t">
              {[
                { l: "Flu.", v: "7.5" },
                { l: "Lex.", v: "7.0" },
                { l: "Gra.", v: "7.5" },
                { l: "Pro.", v: "8.0" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-base font-bold text-primary">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card border shadow-elegant px-4 py-3 flex items-center gap-3 animate-float-tag">
            <div className="h-10 w-10 rounded-full bg-success/15 flex items-center justify-center">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-sm font-bold">Band 7.5</div>
              <div className="text-[10px] text-muted-foreground">Phản hồi trong 3s</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  const stats = [
    { icon: Users, value: <><CountUp to={50} />K+</>, label: "học viên" },
    { icon: GraduationCap, value: <><CountUp to={90} />%</>, label: "đạt mục tiêu" },
    { icon: Star, value: <><CountUp to={4.9} decimals={1} />/5</>, label: "đánh giá" },
  ];
  return (
    <section className="mt-14">
      <div className="rounded-2xl border bg-card divide-y sm:divide-y-0 sm:divide-x sm:grid sm:grid-cols-3 overflow-hidden shadow-soft">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <Reveal key={label} delay={i * 80} direction="up" className="p-5 flex items-center gap-4 hover:bg-accent/20 transition-colors">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-transform hover:scale-110 hover:rotate-6">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold leading-none">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Features({ t }: { t: any }) {
  const items = [
    { icon: Mic, title: "AI Examiner", desc: "Mô phỏng Part 1, 2 & 3 với câu hỏi nối tiếp tự nhiên." },
    { icon: Target, title: "Chấm band tức thì", desc: "Phản hồi chi tiết theo 4 tiêu chí của IELTS." },
    { icon: BookOpen, title: "Vocab thông minh", desc: "Lưu từ trong session, ôn theo spaced repetition." },
    { icon: Brain, title: "Lộ trình cá nhân", desc: "Theo dõi xu hướng, gợi ý điểm cần cải thiện." },
  ];
  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Waves className="h-4 w-4" /> Tính năng cốt lõi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">Mọi thứ bạn cần để chạm band mục tiêu</h2>
        </div>
        <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-right">
          Một bộ công cụ luyện thi Speaking trọn vẹn, được vận hành bởi AI.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border">
        {items.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="bg-card p-6 flex gap-5 hover:bg-accent/30 transition-colors group">
            <div className="text-4xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors w-10 shrink-0">
              0{i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrendShowcase() {
  const points = [5.5, 6.0, 6.0, 6.5, 7.0, 7.5, 7.5, 8.0];
  const w = 280, h = 90, pad = 8;
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / (points.length - 1));
  const ys = points.map((b) => h - pad - ((b - 5) / 4) * (h - pad * 2));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = `${path} L${xs[xs.length - 1]},${h - pad} L${xs[0]},${h - pad} Z`;

  return (
    <section className="mt-16">
      <div className="grid lg:grid-cols-5 gap-6 items-stretch">
        <Card className="lg:col-span-3 p-7 shadow-soft border-0 bg-gradient-hero text-primary-foreground relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-80">
              <TrendingUp className="h-4 w-4" /> Tiến bộ thực tế
            </div>
            <h3 className="text-2xl font-bold mt-2 max-w-md">Từ band 5.5 → 8.0 trong 8 tuần</h3>
            <p className="text-sm opacity-85 mt-2 max-w-md">
              Trung bình học viên tăng 1.5 band sau 6–8 tuần luyện đều với AI Examiner.
            </p>

            <svg viewBox={`0 0 ${w} ${h}`} className="mt-5 w-full max-w-md h-auto">
              <defs>
                <linearGradient id="heroTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#heroTrend)" />
              <path className="draw-path" d={path} fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {xs.map((x, i) => (
                <circle key={i} cx={x} cy={ys[i]} r="3" fill="white" style={{ animation: `fade-in 0.4s ease-out ${0.5 + i * 0.2}s both` }} />
              ))}
            </svg>
          </div>
        </Card>

        <div className="lg:col-span-2 grid gap-4">
          <Card className="p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tốc độ chấm</div>
                <div className="font-bold">Dưới 3 giây / lần</div>
              </div>
            </div>
          </Card>
          <Card className="p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Độ chính xác</div>
                <div className="font-bold">Sát giám khảo IELTS thật</div>
              </div>
            </div>
          </Card>
          <Card className="p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Cá nhân hoá</div>
                <div className="font-bold">Lộ trình theo điểm yếu</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CallToAction({ onStart, t }: { onStart: () => void; t: any }) {
  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 bg-card p-8 sm:p-12">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-primary opacity-20 blur-3xl rounded-full" aria-hidden />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-gradient-hero opacity-20 blur-3xl rounded-full" aria-hidden />

        <div className="relative grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-4 w-4" /> Sẵn sàng bắt đầu?
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 leading-tight">
              Bài thi thử AI đầu tiên của bạn — <span className="bg-gradient-primary bg-clip-text text-transparent">hoàn toàn miễn phí</span>.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Tạo tài khoản trong 30 giây. Không cần thẻ. Không quảng cáo. Chỉ có bạn và giám khảo AI.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Button
              size="lg"
              className="rounded-full h-14 px-8 bg-gradient-primary text-primary-foreground font-semibold shadow-elegant text-base"
              onClick={onStart}
            >
              Bắt đầu miễn phí <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}



function Testimonials() {
  const reviews = [
    { label: "Học viên IELTS · 2026", text: "Luyện thi với AI giúp em tự tin hơn rất nhiều. Câu hỏi sát đề thi thật, phản hồi nhanh và rất chi tiết.", band: "7.5" },
    { label: "Ứng viên band 7.5", text: "Em chuẩn bị thi IELTS chỉ trong 2 tháng. Nhờ luyện speaking mỗi ngày trên app mà em đã đạt 7.5 overall!", band: "7.5" },
    { label: "Người học mới bắt đầu", text: "Em không biết bắt đầu từ đâu, app gợi ý lộ trình rõ ràng. Em đặc biệt thích phần từ vựng theo chủ đề.", band: "7.0" },
    { label: "Học viên chuyển từ trung tâm", text: "Đã từng học ở nhiều trung tâm nhưng app này cho em sự linh hoạt và phản hồi cá nhân hoá tốt nhất.", band: "8.0" },
    { label: "Học viên luyện 3 tuần", text: "Phần chấm điểm rất công bằng. Em thấy được điểm yếu trong grammar và đã cải thiện rõ rệt sau 3 tuần.", band: "7.5" },
    { label: "Học viên từ band 6.0", text: "Giao diện đẹp, dễ dùng, luyện mọi lúc mọi nơi. Em đã từ band 6.0 lên 7.5 chỉ sau 6 tuần.", band: "7.5" },
  ];
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
            key={r.label + i}
            className={`p-5 border-l-4 ${accents[i % accents.length]} shadow-soft hover:shadow-elegant transition-all hover:-translate-y-0.5`}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm truncate">{r.label}</div>
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

