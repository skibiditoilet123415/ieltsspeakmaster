import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Layers, Search, Pencil, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { title: "My Vocabulary — IELTS Speaking Master" },
      { name: "description", content: "Your personal IELTS vocabulary list with pronunciation, CEFR levels and example sentences." },
      { property: "og:title", content: "My Vocabulary — IELTS Speaking Master" },
      { property: "og:description", content: "Search and edit your saved IELTS words, pronunciation, CEFR level and examples." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Vocab />
    </RequireAuth>
  ),
});

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];

type Item = {
  id: string; word: string; pronunciation: string | null; cefr_level: string | null;
  meaning_en: string | null; meaning_vi: string | null; example: string | null;
  next_review: string; difficulty: number | null;
};

function speak(w: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(w);
  u.lang = "en-GB";
  window.speechSynthesis.speak(u);
}

function Vocab() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const vi = lang === "vi";
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"all" | "due">("all");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!user) return;
    supabase.from("vocabulary").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Item[]) || []));
  };
  useEffect(load, [user]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();
    return items.filter((v) => {
      if (filter === "due" && new Date(v.next_review).getTime() > now) return false;
      if (level !== "all" && (v.cefr_level || "").toUpperCase() !== level) return false;
      if (!q) return true;
      return [v.word, v.meaning_en, v.meaning_vi, v.example].some((s) => s?.toLowerCase().includes(q));
    });
  }, [items, filter, level, query]);

  const save = async () => {
    if (!editing) return;
    if (!editing.word.trim()) { toast.error(vi ? "Từ không được để trống" : "Word can't be empty"); return; }
    setSaving(true);
    const { id, word, pronunciation, cefr_level, meaning_en, meaning_vi, example } = editing;
    const { error } = await supabase.from("vocabulary")
      .update({ word: word.trim(), pronunciation, cefr_level, meaning_en, meaning_vi, example }).eq("id", id);
    setSaving(false);
    if (error) { toast.error(vi ? "Lưu thất bại" : "Couldn't save"); return; }
    setItems((xs) => xs.map((x) => (x.id === id ? { ...editing, word: word.trim() } : x)));
    setEditing(null);
    toast.success(vi ? "Đã lưu" : "Saved");
  };

  const remove = async (id: string) => {
    if (!confirm(vi ? "Xoá từ này?" : "Delete this word?")) return;
    await supabase.from("flashcard_reviews").delete().eq("vocabulary_id", id);
    const { error } = await supabase.from("vocabulary").delete().eq("id", id);
    if (error) { toast.error(vi ? "Xoá thất bại" : "Couldn't delete"); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  const set = (k: keyof Item, val: string) => setEditing((e) => (e ? { ...e, [k]: val || null } : e));

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{t("vocab.title")}</h1>
          <p className="text-sm text-muted-foreground">{items.length} {vi ? "từ đã lưu" : "saved words"}</p>
        </div>
        <Link to="/flashcards">
          <Button size="sm" className="bg-gradient-primary gap-1"><Layers className="h-4 w-4" />{t("vocab.flashcards")}</Button>
        </Link>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9"
          placeholder={vi ? "Tìm từ, nghĩa hoặc ví dụ…" : "Search words, meanings or examples…"} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>{t("vocab.filter_all")}</Button>
        <Button size="sm" variant={filter === "due" ? "default" : "outline"} onClick={() => setFilter("due")}>{t("vocab.filter_due")}</Button>
        <span className="w-px bg-border mx-1" />
        {["all", ...CEFR].map((l) => (
          <Button key={l} size="sm" variant={level === l ? "default" : "outline"} onClick={() => setLevel(l)}>
            {l === "all" ? (vi ? "Mọi cấp độ" : "All levels") : l}
          </Button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">{items.length ? (vi ? "Không có kết quả." : "No matches.") : t("vocab.empty")}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {shown.map((v) => (
            <Card key={v.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-lg">{v.word}</span>
                    {v.cefr_level && <span className="text-xs font-semibold rounded-full bg-primary/10 text-primary px-2 py-0.5">{v.cefr_level}</span>}
                  </div>
                  {v.pronunciation && <div className="text-sm text-muted-foreground font-mono">{v.pronunciation}</div>}
                </div>
                <div className="flex shrink-0">
                  <Button size="icon" variant="ghost" aria-label="Pronounce" onClick={() => speak(v.word)}><Volume2 className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing({ ...v })}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(v.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="text-sm mt-2">{vi ? v.meaning_vi || v.meaning_en : v.meaning_en}</div>
              {v.example && <div className="text-sm italic mt-1 text-muted-foreground">"{v.example}"</div>}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{vi ? "Sửa từ vựng" : "Edit word"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label={vi ? "Từ / cụm từ" : "Word / phrase"}><Input value={editing.word} onChange={(e) => setEditing({ ...editing, word: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={vi ? "Phát âm (IPA)" : "Pronunciation (IPA)"}><Input value={editing.pronunciation || ""} onChange={(e) => set("pronunciation", e.target.value)} placeholder="/ˈwɜːd/" /></Field>
                <Field label="CEFR">
                  <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={editing.cefr_level || ""} onChange={(e) => set("cefr_level", e.target.value)}>
                    <option value="">—</option>
                    {CEFR.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <Field label={vi ? "Nghĩa (tiếng Anh)" : "Meaning (English)"}><Textarea rows={2} value={editing.meaning_en || ""} onChange={(e) => set("meaning_en", e.target.value)} /></Field>
              <Field label={vi ? "Nghĩa (tiếng Việt)" : "Meaning (Vietnamese)"}><Textarea rows={2} value={editing.meaning_vi || ""} onChange={(e) => set("meaning_vi", e.target.value)} /></Field>
              <Field label={vi ? "Câu ví dụ" : "Example sentence"}><Textarea rows={2} value={editing.example || ""} onChange={(e) => set("example", e.target.value)} /></Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{vi ? "Huỷ" : "Cancel"}</Button>
            <Button onClick={save} disabled={saving}>{saving ? "…" : vi ? "Lưu" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1"><span className="text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}
