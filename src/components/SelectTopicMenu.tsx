import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, Sparkles, BookOpen, Globe2, Briefcase, Heart, Music, Plane, Utensils, Palette, Cpu, GraduationCap, Trophy, Hash } from "lucide-react";

type Option = { value: string; label: string; count: number };

const ICONS = [Sparkles, BookOpen, Globe2, Briefcase, Heart, Music, Plane, Utensils, Palette, Cpu, GraduationCap, Trophy];
const iconFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return ICONS[h % ICONS.length];
};
const colorFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `oklch(0.7 0.15 ${hue})`;
};

export function SelectTopicMenu({
  value,
  onChange,
  options,
  totalLabel = "All categories",
  totalCount,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  totalLabel?: string;
  totalCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const all: Option[] = [{ value: "all", label: totalLabel, count: totalCount }, ...options];
  const filtered = all.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  const current = all.find((o) => o.value === value) ?? all[0];
  const CurrentIcon = current.value === "all" ? Hash : iconFor(current.value);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`group w-full flex items-center justify-between gap-3 rounded-2xl border bg-card/80 backdrop-blur px-4 py-3 text-sm shadow-soft transition-all duration-300
          ${open ? "border-primary/60 shadow-elegant -translate-y-0.5" : "border-border hover:border-primary/40 hover:-translate-y-0.5"}`}
      >
        <span className="flex items-center gap-3 min-w-0">
          <span
            className="grid place-items-center h-9 w-9 rounded-xl text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${colorFor(current.value)}, var(--primary))` }}
          >
            <CurrentIcon className="h-4 w-4" />
          </span>
          <span className="flex flex-col items-start min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Select category</span>
            <span className="font-semibold truncate">{current.label}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute z-30 left-0 right-0 mt-2 origin-top transition-all duration-300
          ${open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}
      >
        <div className="rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-elegant overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border/60">
            <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus={open}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <ul className="max-h-72 overflow-y-auto p-2">
            {filtered.map((opt, i) => {
              const Icon = opt.value === "all" ? Hash : iconFor(opt.value);
              const active = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    style={{ animationDelay: `${i * 30}ms` }}
                    className={`menu-item-enter group/it w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200
                      ${active ? "bg-primary/10 text-foreground" : "hover:bg-muted/70 hover:translate-x-1"}`}
                  >
                    <span
                      className="grid place-items-center h-8 w-8 rounded-lg text-white transition-transform duration-300 group-hover/it:scale-110 group-hover/it:-rotate-6"
                      style={{ background: `linear-gradient(135deg, ${colorFor(opt.value)}, var(--primary))` }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-left truncate font-medium">{opt.label}</span>
                    <span className={`text-xs rounded-full px-2 py-0.5 transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {opt.count}
                    </span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="text-center text-xs text-muted-foreground py-6">No categories found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
