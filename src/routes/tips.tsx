import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";
import { Lightbulb, Mic, MessageCircle, BookOpen, Sparkles, Clock, Target, CheckCircle2, Play } from "lucide-react";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "IELTS Speaking Tips — Structure, Topics & Band 7+ Strategies" },
      {
        name: "description",
        content:
          "A complete guide to the IELTS Speaking test: structure, common topics for Parts 1, 2 & 3, and proven tips to score Band 7+.",
      },
    ],
  }),
  component: TipsPage,
});

const part1Topics = [
  { title: "Hometown", qs: ["Where are you from?", "What do you like most about your hometown?", "Has your hometown changed much in recent years?"] },
  { title: "Study / Work", qs: ["Are you studying or working?", "Why did you choose this field?", "What do you enjoy most about it?"] },
  { title: "Family", qs: ["Can you tell me about your family?", "Who do you spend the most time with?", "Are family relationships important?"] },
  { title: "Hobbies", qs: ["What do you do in your free time?", "Indoor or outdoor activities?", "Have your hobbies changed since childhood?"] },
  { title: "Travel", qs: ["Do you like traveling? Why?", "Favorite destination?", "Alone or with others?"] },
  { title: "Food", qs: ["Favorite type of food?", "Eat out or at home?", "Famous food in your country?"] },
  { title: "Seasons / Weather", qs: ["Favorite season?", "Hot or cold weather?", "Has the weather changed recently?"] },
  { title: "Technology", qs: ["What gadgets do you use daily?", "Could you live without your phone?", "Favorite app?"] },
  { title: "Reading", qs: ["Do you like reading?", "Books or movies?", "Favorite author?"] },
  { title: "Sports", qs: ["Do you play any sports?", "Team or individual?", "Why are sports important?"] },
];

const part2Cues = [
  { title: "A Memorable Trip", points: ["Where you went", "Who you went with", "What you did there", "Why it was memorable"] },
  { title: "A Book You Enjoyed", points: ["What it was about", "Why you chose it", "What you learned", "How you felt about it"] },
  { title: "A Hobby You Enjoy", points: ["What the hobby is", "When you started", "How you do it", "Why you enjoy it"] },
  { title: "A Favorite Restaurant", points: ["Where it is", "What it serves", "Why you like it", "What makes it special"] },
  { title: "A Piece of Technology You Use", points: ["What it is", "When you started using it", "How it helps you", "Life without it"] },
  { title: "A Person You Admire", points: ["Who they are", "How you know them", "What they do", "Why you admire them"] },
  { title: "A Special Gift You Received", points: ["What it was", "Who gave it", "Why it was special", "How you felt"] },
  { title: "A Festival or Celebration", points: ["What it is", "Why it's celebrated", "How it's celebrated", "Why it's important"] },
  { title: "A Place You'd Like to Visit", points: ["Where it is", "Why you want to go", "What you'll do", "How you feel about it"] },
  { title: "A Childhood Memory", points: ["What it was about", "When it happened", "How you felt", "Why it's still memorable"] },
];

const part3Topics = [
  { title: "Travel & Tourism", qs: ["How important is tourism to a country's economy?", "Negative effects of tourism on local culture?", "How can governments promote sustainable tourism?"] },
  { title: "Education", qs: ["Traditional classrooms vs online learning?", "Should older people continue to study?", "How can schools prepare students for the workplace?"] },
  { title: "Technology", qs: ["Has technology made life easier or more complicated?", "Pros and cons of AI in daily life?", "Are people spending too much time on phones?"] },
  { title: "Books & Reading", qs: ["Are people reading less than before?", "Reading vs watching movies?", "Will printed books disappear?"] },
  { title: "Work–Life Balance", qs: ["Why is work-life balance hard to maintain?", "How can companies help?", "Do long hours reduce productivity?"] },
  { title: "Environment", qs: ["Main environmental problems in your country?", "What can individuals do?", "How can renewable energy help?"] },
  { title: "Family & Relationships", qs: ["Role of parents today?", "How have family roles changed?", "Has tech affected family communication?"] },
  { title: "Transportation", qs: ["Biggest transport problems in cities?", "Public transport vs private?", "Future of transportation?"] },
  { title: "Media & News", qs: ["Does media focus too much on negative news?", "How to spot fake news?", "Role of social media in news?"] },
  { title: "Art & Culture", qs: ["Why is art important for society?", "Are traditional arts being replaced?", "Impact of globalization on culture?"] },
];

function SectionHeader({ icon: Icon, eyebrow, title, desc }: any) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="text-xl font-bold mt-1">{title}</h2>
      {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
    </div>
  );
}

function TipsPage() {
  const navigate = useNavigate();

  const startSession = (tp: {
    title: string;
    category: string;
    part1_questions?: string[];
    part2_cue?: { prompt: string; points: string[] };
  }) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "pendingSpeakingTopic",
        JSON.stringify({
          id: null,
          difficulty: 6,
          part1_questions: [],
          ...tp,
        }),
      );
    }
    navigate({ to: "/speaking" });
  };

  return (
    <AppShell>
      <Reveal>
        <Card className="p-6 bg-gradient-hero text-primary-foreground border-0 shadow-elegant mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
            <Lightbulb className="h-4 w-4" /> Speaking Guide
          </div>
          <h1 className="text-2xl font-bold mt-2">Tips to do well in IELTS Speaking</h1>
          <p className="text-sm opacity-90 mt-2">
            The IELTS Speaking test lasts 11–14 minutes and assesses your ability to
            communicate in real-life English. It's split into 3 parts and recorded for fairness.
            Below is a complete cheat-sheet you can revisit any time.
          </p>
        </Card>
      </Reveal>

      <Reveal>
        <SectionHeader
          icon={Target}
          eyebrow="Overview"
          title="Test structure at a glance"
          desc="Same structure for Academic and General Training."
        />
        <div className="grid grid-cols-1 gap-3 mb-8">
          {[
            { p: "Part 1", time: "4–5 min", title: "Introduction & Interview", desc: "Short personal questions about your life — hometown, study, hobbies, etc." },
            { p: "Part 2", time: "3–4 min", title: "Long Turn (Cue Card)", desc: "1 minute to prepare, then speak for 1–2 minutes on a given topic." },
            { p: "Part 3", time: "4–5 min", title: "Two-way Discussion", desc: "Deeper, abstract questions related to the Part 2 topic." },
          ].map((x) => (
            <Card key={x.p} className="p-4 hover:shadow-elegant transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-primary">{x.p}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {x.time}
                </div>
              </div>
              <div className="font-semibold mt-1">{x.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{x.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <SectionHeader
          icon={MessageCircle}
          eyebrow="Part 1"
          title="Common topics & sample questions"
          desc="Keep answers natural — give enough info, but don't ramble."
        />
        <div className="grid grid-cols-1 gap-3 mb-4">
          {part1Topics.map((t) => (
            <Card
              key={t.title}
              onClick={() =>
                startSession({
                  title: t.title,
                  category: "Part 1",
                  part1_questions: t.qs,
                })
              }
              className="p-4 cursor-pointer hover:shadow-elegant hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{t.title}</div>
                <Play className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {t.qs.map((q) => (
                  <li key={q} className="flex gap-2">
                    <span className="text-primary">•</span> {q}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card className="p-4 mb-8 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold">Tip:</span> avoid one-word answers.
              Add a short reason or example to every reply — but don't over-explain.
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal>
        <SectionHeader
          icon={Mic}
          eyebrow="Part 2"
          title="Popular cue cards"
          desc="Use your 1-minute prep wisely. Note keywords, not full sentences."
        />
        <div className="grid grid-cols-1 gap-3 mb-4">
          {part2Cues.map((c) => (
            <Card key={c.title} className="p-4">
              <div className="font-semibold text-sm">{c.title}</div>
              <div className="text-xs text-muted-foreground mt-1">You should say:</div>
              <ul className="mt-1 space-y-1 text-sm">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card className="p-4 mb-8 bg-primary/5 border-primary/20">
          <div className="text-sm space-y-2">
            <div><span className="font-semibold">Plan smart:</span> jot down keywords (e.g. <em>Da Lat – family – cool weather – bonding</em>).</div>
            <div><span className="font-semibold">Structure:</span> short intro → answer the 4 prompts → why it matters.</div>
            <div><span className="font-semibold">Time it:</span> practice with a stopwatch to nail the 1–2 minute window.</div>
          </div>
        </Card>
      </Reveal>

      <Reveal>
        <SectionHeader
          icon={BookOpen}
          eyebrow="Part 3"
          title="Discussion topics"
          desc="Give an opinion, justify it with reasons or examples."
        />
        <div className="grid grid-cols-1 gap-3 mb-4">
          {part3Topics.map((t) => (
            <Card key={t.title} className="p-4">
              <div className="font-semibold text-sm">{t.title}</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {t.qs.map((q) => (
                  <li key={q} className="flex gap-2">
                    <span className="text-primary">•</span> {q}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card className="p-4 mb-8 bg-primary/5 border-primary/20">
          <div className="text-sm space-y-2">
            <div><span className="font-semibold">Argue clearly:</span> opinion + reason + example.</div>
            <div><span className="font-semibold">Use linkers:</span> <em>On the one hand, On the other hand, From my perspective, To illustrate…</em></div>
            <div><span className="font-semibold">Be specific:</span> real or imagined examples beat vague claims.</div>
          </div>
        </Card>
      </Reveal>

      <Reveal>
        <Card className="p-5 bg-gradient-primary text-primary-foreground border-0 shadow-elegant">
          <div className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4" /> Ready to practice?</div>
          <p className="text-sm opacity-90 mt-1">Start a real test with the AI examiner and apply these tips.</p>
        </Card>
      </Reveal>
    </AppShell>
  );
}
