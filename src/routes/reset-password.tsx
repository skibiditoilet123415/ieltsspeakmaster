import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logoUrl from "@/assets/logo.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — IELTS Speaking AI" }] }),
  component: ResetPasswordPage,
});

const COOLDOWN_SECONDS = 60;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // resend states
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [manualEmail, setManualEmail] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionValid, setSessionValid] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const [resendBusy, setResendBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      setSessionChecked(true);
      if (error || !data.user?.email) {
        setSessionValid(false);
      } else {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated!");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    const target = userEmail || manualEmail;
    if (!target) {
      toast.error("Please enter your email");
      return;
    }
    setResendBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(target, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      toast.success("Reset link resent! Check your email.");
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend");
    } finally {
      setResendBusy(false);
    }
  };

  const canResend = cooldown === 0 && !resendBusy;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10" style={{ background: "#ececec" }}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] px-8 py-10">
        <div className="flex justify-center mb-5">
          <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-xl object-contain" />
        </div>

        {sessionChecked && !sessionValid ? (
          <>
            <h1 className="text-center text-2xl font-bold text-neutral-900">Link expired</h1>
            <p className="text-center text-sm text-neutral-500 mt-1">
              Request a new reset link below
            </p>
            <div className="mt-7 space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-600">Email</label>
                <Input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                />
              </div>
              <Button
                type="button"
                disabled={!canResend}
                onClick={handleResend}
                className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
              >
                {resendBusy
                  ? "Sending..."
                  : cooldown > 0
                  ? `Resend email (${cooldown}s)`
                  : "Resend reset email"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl font-bold text-neutral-900">Set a new password</h1>
            <p className="text-center text-sm text-neutral-500 mt-1">
              Enter your new password below
            </p>
            <form onSubmit={submit} className="mt-7 space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-600">New password</label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-900"
                />
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="w-full h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
              >
                {busy ? "Updating..." : "Update password"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                disabled={!canResend}
                onClick={handleResend}
                className="text-xs text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed font-medium"
              >
                {cooldown > 0 ? `Resend reset email (${cooldown}s)` : "Resend reset email"}
              </button>
            </div>
          </>
        )}

        <p className="text-center text-xs text-neutral-500 mt-6">
          <Link to="/auth" className="text-neutral-900 font-medium hover:underline">
            ← Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
