import { Link, useLocation } from "@tanstack/react-router";
import { Mic, BookOpen, Settings as SettingsIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const { t } = useI18n();
  const location = useLocation();
  const path = location.pathname;

  const isSpeaking = path === "/" || path.startsWith("/speaking") || path.startsWith("/history");
  const isVocab = path.startsWith("/vocabulary") || path.startsWith("/flashcards");
  const isSettings = path.startsWith("/settings");

  const item = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur safe-bottom"
      aria-label="Primary"
    >
      <div className="mx-auto max-w-xl flex items-stretch">
        <Link to="/" className={item(isSpeaking)}>
          <Mic className="h-5 w-5" />
          <span className="text-xs font-medium">{t("nav.speaking")}</span>
        </Link>
        <Link to="/vocabulary" className={item(isVocab)}>
          <div className={`relative flex items-center justify-center h-10 w-10 rounded-full ${
            isVocab ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary"
          }`}>
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">{t("nav.vocab")}</span>
        </Link>
        <Link to="/settings" className={item(isSettings)}>
          <SettingsIcon className="h-5 w-5" />
          <span className="text-xs font-medium">{t("nav.settings")}</span>
        </Link>
      </div>
    </nav>
  );
}
