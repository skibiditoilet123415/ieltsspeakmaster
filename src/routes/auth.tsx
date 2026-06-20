import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
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

type Mode = "signin" | "signup" | "forgot" | "verify";
type Channel = "email" | "phone";

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("signin");
  const [signupChannel, setSignupChannel] = useState<Channel>("email");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  // verification (post-signup) + forgot password flow
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyCooldown, setVerifyCooldown] = useState(0);

  const [channel, setChannel] = useState<Channel>("email");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (user && mode !== "verify") navigate({ to: "/" });
  }, [user, navigate, mode]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (verifyCooldown <= 0) return;
    const id = setInterval(() => setVerifyCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [verifyCooldown]);

  const resetForgot = () => {
    setOtpSent(false);
    setOtp("");
    setNewPw("");
    setEmailSent(false);
    setCooldown(0);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (signupChannel === "email" && !email) throw new Error("Please enter your email");
        if (signupChannel === "phone" && !phone) throw new Error("Please enter your phone number");
        if (!username.trim()) throw new Error("Please choose a username");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        if (password !== confirmPassword) throw new Error("Passwords do not match");

        const { error } = await supabase.auth.signUp({
          email: signupChannel === "email" ? email : undefined,
          phone: signupChannel === "phone" ? phone : undefined,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              username: username.trim(),
              display_name: username.trim(),
              phone: signupChannel === "phone" ? phone : null,
            },
          },
        } as any);
        if (error) throw error;
        toast.success(
          signupChannel === "email"
            ? "We sent a 6-digit code to your email"
            : "We sent a 6-digit code to your phone"
        );
        setMode("verify");
        setVerifyCooldown(60);
      } else if (mode === "verify") {
        if (!verifyCode) throw new Error("Enter the verification code");
        const { error } = await supabase.auth.verifyOtp(
          signupChannel === "email"
            ? { email, token: verifyCode, type: "email" }
            : ({ phone, token: verifyCode, type: "sms" } as any)
        );
        if (error) throw error;
        toast.success("Account verified! Welcome aboard.");
        navigate({ to: "/" });
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(
          email ? { email, password } : ({ phone, password } as any)
        );
        if (error) throw error;
      } else if (mode === "forgot") {
        if (channel === "email") {
          if (!email) throw new Error("Enter your email");
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/reset-password",
          });
          if (error) throw error;
          toast.success("Reset link sent! Check your email.");
          setEmailSent(true);
          setCooldown(60);
        } else {
          if (!otpSent) {
            if (!phone) throw new Error("Enter your phone number");
            const { error } = await supabase.auth.signInWithOtp({ phone });
            if (error) throw error;
            setOtpSent(true);
            toast.success("Verification code sent to your phone");
            setCooldown(60);
          } else {
            const { error: vErr } = await supabase.auth.verifyOtp({
              phone,
              token: otp,
              type: "sms",
            });
            if (vErr) throw vErr;
            const { error: uErr } = await supabase.auth.updateUser({ password: newPw });
            if (uErr) throw uErr;
            toast.success("Password updated! You're signed in.");
            navigate({ to: "/" });
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  const resendVerification = async () => {
    if (verifyCooldown > 0) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend(
        signupChannel === "email"
          ? { type: "signup", email }
          : ({ type: "sms", phone } as any)
      );
      if (error) throw error;
      toast.success("Code resent");
      setVerifyCooldown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(result.error.message || t("common.error"));
    if (result.redirected) return;
  };

  const isSignin = mode === "signin";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isVerify = mode === "verify";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10" style={{ background: "#ececec" }}>
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 w-[360px] h-[360px] mr-2"
        >
          <AuthMascot passwordFocused={pwFocused} />
        </div>

        <div className="bg-white rounded-3xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] px-8 py-10">
          <div className="flex justify-center mb-5">
            <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-xl object-contain" />
          </div>

          <h1 className="text-center text-2xl font-bold text-neutral-900">
            {isSignin
              ? "Welcome back!"
              : isSignup
              ? "Create your account"
              : isVerify
              ? "Verify your account"
              : "Reset password"}
          </h1>
          <p className="text-center text-sm text-neutral-500 mt-1">
            {isSignin
              ? "Please enter your details"
              : isSignup
              ? "Start your IELTS Speaking journey"
              : isVerify
              ? `Enter the 6-digit code sent to your ${signupChannel === "email" ? email : phone}`
              : otpSent
              ? "Enter the code and a new password"
              : "We'll send a reset to your email or phone"}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="text-xs font-medium text-neutral-600">Username</label>
                  <Input
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                  />
                </div>

                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSignupChannel("email")}
                    className={`flex-1 h-9 rounded-full border ${signupChannel === "email" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 text-neutral-700"}`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupChannel("phone")}
                    className={`flex-1 h-9 rounded-full border ${signupChannel === "phone" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 text-neutral-700"}`}
                  >
                    Phone
                  </button>
                </div>

                {signupChannel === "email" ? (
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
                ) : (
                  <div>
                    <label className="text-xs font-medium text-neutral-600">Phone</label>
                    <Input
                      type="tel"
                      required
                      placeholder="+15551234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                    />
                  </div>
                )}

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

                <div>
                  <label className="text-xs font-medium text-neutral-600">Re-enter password</label>
                  <Input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                  />
                </div>
              </>
            )}

            {isVerify && (
              <>
                <div>
                  <label className="text-xs font-medium text-neutral-600">Verification code</label>
                  <Input
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900 text-center tracking-[0.5em] text-lg"
                  />
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    disabled={verifyCooldown > 0 || busy}
                    onClick={resendVerification}
                    className="text-xs text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed font-medium"
                  >
                    {verifyCooldown > 0 ? `Resend code (${verifyCooldown}s)` : "Resend code"}
                  </button>
                </div>
              </>
            )}

            {isForgot && (
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setChannel("email"); resetForgot(); }}
                  className={`flex-1 h-9 rounded-full border ${channel === "email" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 text-neutral-700"}`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => { setChannel("phone"); resetForgot(); }}
                  className={`flex-1 h-9 rounded-full border ${channel === "phone" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 text-neutral-700"}`}
                >
                  Phone
                </button>
              </div>
            )}

            {(isSignin || (isForgot && channel === "email")) && (
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
            )}

            {isForgot && channel === "phone" && (
              <div>
                <label className="text-xs font-medium text-neutral-600">Phone</label>
                <Input
                  type="tel"
                  placeholder="+15551234567"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                />
              </div>
            )}

            {isSignin && (
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
            )}

            {isForgot && otpSent && channel === "phone" && (
              <>
                <div>
                  <label className="text-xs font-medium text-neutral-600">Verification code</label>
                  <Input
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">New password</label>
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                  />
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    disabled={cooldown > 0 || busy}
                    onClick={() => {
                      if (cooldown > 0 || !phone) return;
                      setBusy(true);
                      supabase.auth.signInWithOtp({ phone })
                        .then(({ error }) => {
                          if (error) throw error;
                          toast.success("Verification code resent to your phone");
                          setCooldown(60);
                        })
                        .catch((err: any) => toast.error(err.message || "Failed to resend"))
                        .finally(() => setBusy(false));
                    }}
                    className="text-xs text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed font-medium"
                  >
                    {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
                  </button>
                </div>
              </>
            )}

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
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); resetForgot(); }}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={busy || (isForgot && cooldown > 0 && ((channel === "email" && emailSent) || (channel === "phone" && !otpSent)))}
              className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
            >
              {busy
                ? t("common.loading")
                : isSignin
                ? "Log in"
                : isSignup
                ? "Sign up"
                : isVerify
                ? "Verify & continue"
                : otpSent
                ? "Update password"
                : channel === "email"
                ? emailSent && cooldown > 0
                  ? `Resend email (${cooldown}s)`
                  : "Send reset email"
                : cooldown > 0
                ? `Resend code (${cooldown}s)`
                : "Send code"}
            </Button>

            {!isForgot && !isVerify && (
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
            )}
          </form>

          <p className="text-center text-xs text-neutral-500 mt-6">
            {isForgot ? (
              <button
                className="text-neutral-900 font-medium hover:underline"
                onClick={() => { setMode("signin"); resetForgot(); }}
              >
                ← Back to log in
              </button>
            ) : isVerify ? (
              <button
                className="text-neutral-900 font-medium hover:underline"
                onClick={() => { setMode("signup"); setVerifyCode(""); }}
              >
                ← Back to sign up
              </button>
            ) : (
              <>
                {isSignin ? "Don't have an account? " : "Already have an account? "}
                <button
                  className="text-neutral-900 font-medium hover:underline"
                  onClick={() => setMode(isSignin ? "signup" : "signin")}
                >
                  {isSignin ? "Sign up" : "Log in"}
                </button>
              </>
            )}
          </p>
        </div>

        <div className="text-center text-[11px] text-neutral-400 mt-4">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
