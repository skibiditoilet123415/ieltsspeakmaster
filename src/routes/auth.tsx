import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

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

  const isSignin = mode === "signin";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10" style={{ background: "#ececec" }}>
      {/* Stage: holds the centered card plus the mascots floating to its left */}
      <div className="relative w-full max-w-md">
        {/* Mascots — sit on the gray background to the LEFT of the card on md+ */}
        <div
          aria-hidden
          className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 w-[360px] h-[360px] mr-2"
        >
          <AuthMascot passwordFocused={pwFocused} />
        </div>

        {/* The card */}
        <div className="bg-white rounded-3xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] px-8 py-10">
          <div className="flex justify-center mb-5">
            <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-xl object-contain" />
          </div>

          <h1 className="text-center text-2xl font-bold text-neutral-900">
            {isSignin ? "Welcome back!" : "Create your account"}
          </h1>
          <p className="text-center text-sm text-neutral-500 mt-1">
            {isSignin ? "Please enter your details" : "Start your IELTS Speaking journey"}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {!isSignin && (
              <div>
                <label className="text-xs font-medium text-neutral-600">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-neutral-600">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">Password</label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  className="mt-1 border-0 border-b rounded-none px-0 pr-8 focus-visible:ring-0 focus-visible:border-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignin && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 accent-neutral-900"
                  />
                  Remember me
                </label>
                <button type="button" className="text-neutral-600 hover:text-neutral-900">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={busy}
              className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
            >
              {busy ? t("common.loading") : isSignin ? "Log in" : "Sign up"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={google}
              className="w-full h-11 rounded-full border-neutral-200 font-medium"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 7.1 29.5 5 24 5 16 5 9.1 9.5 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.4 35 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9 40.4 16 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.3 5.3C41.6 36 44 30.4 44 24c0-1.2-.1-2.3-.4-3.5z" />
              </svg>
              {isSignin ? "Log in with Google" : "Sign up with Google"}
            </Button>
          </form>

          <p className="text-center text-xs text-neutral-500 mt-6">
            {isSignin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-neutral-900 font-medium hover:underline"
              onClick={() => setMode(isSignin ? "signup" : "signin")}
            >
              {isSignin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

        <div className="text-center text-[11px] text-neutral-400 mt-4">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
