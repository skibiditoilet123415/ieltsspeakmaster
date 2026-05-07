import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logoUrl from "@/assets/logo.png";
import { AuthMascot } from "@/components/AuthMascot";

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
  const [pwFocused, setPwFocused] = useState(false);

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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message || t("common.error"));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-card rounded-3xl shadow-elegant overflow-hidden">
        {/* Left: animated mascot panel */}
        <div className="relative hidden md:block bg-gradient-primary min-h-[560px]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "32px 32px, 48px 48px" }} />
          <div className="relative z-10 p-8 text-primary-foreground">
            <div className="text-sm uppercase tracking-widest opacity-80">Welcome</div>
            <div className="text-2xl font-bold mt-1">Ready to speak?</div>
            <p className="text-sm opacity-90 mt-2 max-w-xs">Sign in to start your IELTS Speaking journey with AI-powered practice.</p>
          </div>
          <div className="absolute inset-0 pt-24">
            <AuthMascot passwordFocused={pwFocused} />
          </div>
        </div>

        {/* Right: form panel */}
        <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src={logoUrl} alt="IELTS Speaking Master logo" className="h-11 w-11 rounded-xl object-contain" />
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
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPwFocused(true)} onBlur={() => setPwFocused(false)} />
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
    </div>
  );
}
