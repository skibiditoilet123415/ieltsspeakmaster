import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: () => (
    <RequireAuth>
      <Settings />
    </RequireAuth>
  ),
});

function Settings() {
  const { user, signOut } = useAuth();
  const { t, lang, setLang } = useI18n();
  const [target, setTarget] = useState<string>("7.0");
  const [theme, setThemeLocal] = useState<"light" | "dark">(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("target_band").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.target_band) setTarget(String(data.target_band));
    });
  }, [user]);

  const applyTheme = (v: "light" | "dark") => {
    setThemeLocal(v);
    document.documentElement.classList.toggle("dark", v === "dark");
    localStorage.setItem("theme", v);
  };

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      target_band: Number(target),
      language: lang,
      theme,
    }).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success(t("settings.saved"));
  };

  return (
    <AppShell>
      <h1 className="text-xl font-bold mb-4">{t("settings.title")}</h1>
      <div className="space-y-4">
        <Card className="p-4">
          <Label>{t("settings.language")}</Label>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>English</Button>
            <Button size="sm" variant={lang === "vi" ? "default" : "outline"} onClick={() => setLang("vi")}>Tiếng Việt</Button>
          </div>
        </Card>

        <Card className="p-4">
          <Label>{t("settings.theme")}</Label>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant={theme === "light" ? "default" : "outline"} onClick={() => applyTheme("light")}>{t("settings.light")}</Button>
            <Button size="sm" variant={theme === "dark" ? "default" : "outline"} onClick={() => applyTheme("dark")}>{t("settings.dark")}</Button>
          </div>
        </Card>

        <Card className="p-4">
          <Label>{t("settings.target")}</Label>
          <Input type="number" step="0.5" min="4" max="9" value={target} onChange={(e) => setTarget(e.target.value)} className="mt-2" />
        </Card>

        <Button className="w-full bg-gradient-primary" onClick={save}>{t("settings.save")}</Button>

        <Button variant="outline" className="w-full gap-2" onClick={signOut}>
          <LogOut className="h-4 w-4" /> {t("auth.logout")}
        </Button>
      </div>
    </AppShell>
  );
}
