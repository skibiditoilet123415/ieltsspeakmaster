import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { PREMIUM_PRICE_LABEL, FREE_TOPIC_LIMIT } from "@/lib/premium";
import { toast } from "sonner";

interface PaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicTitle?: string;
}

export function Paywall({ open, onOpenChange, topicTitle }: PaywallProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 border-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-3 shadow-elegant">
            <Crown className="h-7 w-7" />
          </div>
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-xl font-bold text-primary-foreground">
              Unlock all topics
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 text-sm">
              {topicTitle ? (
                <>“{topicTitle}” is a Premium topic.</>
              ) : (
                <>Free plan includes only {FREE_TOPIC_LIMIT} topics.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-center">
            <div className="text-3xl font-extrabold tracking-tight">{PREMIUM_PRICE_LABEL}</div>
            <div className="text-xs opacity-80 mt-0.5">One-time payment · Lifetime access</div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <ul className="space-y-2.5 text-sm">
            {[
              "Access to all 100+ speaking topics",
              "5 structured lessons per topic",
              "Unlimited daily speaking tests",
              "Full vocabulary library & flashcards",
              "Priority AI feedback",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2">
            <Button
              className="w-full bg-gradient-primary text-primary-foreground shadow-elegant"
              onClick={() => toast("Payment coming soon — we'll notify you!", { icon: "✨" })}
            >
              <Sparkles className="h-4 w-4" />
              Upgrade for {PREMIUM_PRICE_LABEL}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
              Maybe later
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" /> Secure payment · 7-day refund guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
