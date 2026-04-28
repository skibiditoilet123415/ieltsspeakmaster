import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mic } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — IELTS Speaking AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) toast.error(result.error.message || t("common.error"));
    } catch {
      toast.error("Google sign-in is not configured yet.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold">{t("app.name")}</div>
            <div className="text-xs text-muted-foreground">{t("app.tagline")}</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">{mode === "signin" ? t("auth.signin") : t("auth.signup")}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "signin" ? t("auth.no_account") : t("auth.have_account")}{" "}
          <button className="text-primary font-medium" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? t("auth.signup") : t("auth.signin")}
          </button>
        </p>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label>{t("auth.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div>
            <Label>{t("auth.email")}</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>{t("auth.password")}</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-gradient-primary shadow-soft">
            {busy ? t("common.loading") : mode === "signin" ? t("auth.signin") : t("auth.signup")}
          </Button>
        </form>

        <div className="relative my-6 text-center text-xs text-muted-foreground">
          <span className="bg-card px-2 relative z-10">{t("auth.or")}</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <Button variant="outline" className="w-full" onClick={google}>
          {t("auth.google")}
        </Button>
      </div>
    </div>
  );
}
