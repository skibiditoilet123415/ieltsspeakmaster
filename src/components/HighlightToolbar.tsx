import { useEffect, useRef, useState } from "react";
import { Highlighter, Underline, Star, X, Volume2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type ToolbarState = {
  visible: boolean;
  x: number;
  y: number;
  text: string;
};

type WordInfo = {
  word: string;
  pronunciation: string;
  cefr_level: string;
  meaning_en: string;
  meaning_vi: string;
  example: string;
};

const COLORS = [
  { name: "yellow", bg: "#fef08a", ring: "#eab308" },
  { name: "green", bg: "#bbf7d0", ring: "#16a34a" },
  { name: "pink", bg: "#fbcfe8", ring: "#db2777" },
  { name: "blue", bg: "#bfdbfe", ring: "#2563eb" },
];

function isEditable(node: Node | null): boolean {
  let el = node instanceof HTMLElement ? node : node?.parentElement || null;
  while (el) {
    if (el.isContentEditable) return true;
    const tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return true;
    if (el.dataset?.noHighlight === "true") return true;
    el = el.parentElement;
  }
  return false;
}

function wrapSelection(style: { bg?: string; underline?: boolean }) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  if (isEditable(range.commonAncestorContainer)) return;
  try {
    const mark = document.createElement("mark");
    mark.className = "lov-highlight";
    if (style.bg) {
      mark.style.backgroundColor = style.bg;
      mark.style.color = "inherit";
      mark.style.borderRadius = "2px";
      mark.style.padding = "0 2px";
    } else {
      mark.style.background = "transparent";
    }
    if (style.underline) {
      mark.style.textDecoration = "underline";
      mark.style.textDecorationThickness = "2px";
      mark.style.textUnderlineOffset = "3px";
      mark.style.textDecorationColor = style.bg || "#2563eb";
    }
    range.surroundContents(mark);
    sel.removeAllRanges();
  } catch {
    // Selection crosses element boundaries — fall back: do nothing
  }
}

export function HighlightToolbar() {
  const { user } = useAuth();
  const [tb, setTb] = useState<ToolbarState>({ visible: false, x: 0, y: 0, text: "" });
  const [panel, setPanel] = useState<{ open: boolean; text: string }>({ open: false, text: "" });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<WordInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onUp(e: MouseEvent | TouchEvent) {
      // Ignore clicks inside our own UI
      if (rootRef.current?.contains(e.target as Node)) return;
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
          setTb((s) => ({ ...s, visible: false }));
          return;
        }
        const text = sel.toString().trim();
        if (!text || text.length > 120) {
          setTb((s) => ({ ...s, visible: false }));
          return;
        }
        const range = sel.getRangeAt(0);
        if (isEditable(range.commonAncestorContainer)) return;
        const rect = range.getBoundingClientRect();
        if (!rect.width && !rect.height) return;
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        setTb({ visible: true, x, y, text });
      }, 10);
    }
    function onScroll() { setTb((s) => ({ ...s, visible: false })); }
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  function applyColor(bg: string) {
    wrapSelection({ bg });
    setTb((s) => ({ ...s, visible: false }));
  }
  function applyUnderline() {
    wrapSelection({ underline: true, bg: "#2563eb" });
    setTb((s) => ({ ...s, visible: false }));
  }

  async function openSavePanel() {
    const text = tb.text;
    setTb((s) => ({ ...s, visible: false }));
    setPanel({ open: true, text });
    setInfo(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("define-word", { body: { word: text } });
      if (error) throw error;
      setInfo(data as WordInfo);
    } catch (e: any) {
      toast.error("Could not fetch definition");
      setPanel({ open: false, text: "" });
    } finally {
      setLoading(false);
    }
  }

  async function saveVocab() {
    if (!info) return;
    if (!user) { toast.error("Please sign in to save vocabulary"); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("vocabulary").upsert({
        user_id: user.id,
        word: info.word,
        pronunciation: info.pronunciation,
        cefr_level: info.cefr_level,
        meaning_en: info.meaning_en,
        meaning_vi: info.meaning_vi,
        example: info.example,
        source: "user",
      }, { onConflict: "user_id,word" });
      if (error) throw error;
      toast.success("Saved to vocabulary");
      setPanel({ open: false, text: "" });
    } catch (e: any) {
      toast.error(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function speak() {
    if (!info?.word) return;
    try {
      const u = new SpeechSynthesisUtterance(info.word);
      u.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }

  return (
    <div ref={rootRef} data-no-highlight="true">
      {tb.visible && (
        <div
          className="fixed z-[100] -translate-x-1/2 -translate-y-[calc(100%+8px)] flex items-center gap-1 rounded-xl border border-border bg-popover px-2 py-1.5 shadow-lg"
          style={{ left: tb.x, top: tb.y }}
        >
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => applyColor(c.bg)}
              className="size-6 rounded-full ring-1 ring-border hover:scale-110 transition"
              style={{ backgroundColor: c.bg }}
              title={`Highlight ${c.name}`}
              aria-label={`Highlight ${c.name}`}
            />
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          <button
            onClick={applyUnderline}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground hover:bg-muted"
            title="Underline"
            aria-label="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            onClick={openSavePanel}
            className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            title="Save to vocabulary"
          >
            <Star className="h-3.5 w-3.5" /> Save
          </button>
        </div>
      )}

      {panel.open && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/40 p-3" onClick={() => setPanel({ open: false, text: "" })}>
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-popover p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Highlighted</div>
                <div className="mt-1 text-xl font-semibold">"{panel.text}"</div>
              </div>
              <button
                onClick={() => setPanel({ open: false, text: "" })}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 min-h-[120px]">
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Looking up dictionary…
                </div>
              )}

              {!loading && info && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-semibold">{info.word}</span>
                    {info.pronunciation && (
                      <span className="text-sm text-muted-foreground">{info.pronunciation}</span>
                    )}
                    <button
                      onClick={speak}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground hover:bg-muted"
                      title="Listen"
                      aria-label="Listen"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    {info.cefr_level && (
                      <span className="rounded-md border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">
                        {info.cefr_level}
                      </span>
                    )}
                  </div>
                  {info.meaning_en && (
                    <div className="text-sm"><span className="font-medium">EN:</span> {info.meaning_en}</div>
                  )}
                  {info.meaning_vi && (
                    <div className="text-sm"><span className="font-medium">VI:</span> {info.meaning_vi}</div>
                  )}
                  {info.example && (
                    <div className="text-sm italic text-muted-foreground">"{info.example}"</div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-3">
              <div className="text-sm text-muted-foreground">Save to your personal vocabulary?</div>
              <div className="mt-2 flex gap-2 justify-end">
                <button
                  onClick={() => setPanel({ open: false, text: "" })}
                  className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
                  disabled={saving}
                >
                  No
                </button>
                <button
                  onClick={saveVocab}
                  disabled={!info || saving}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Yes, save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
