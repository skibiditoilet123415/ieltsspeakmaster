import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Mic, BookOpen, History as HistoryIcon, Settings as SettingsIcon, Sparkles, LogOut, Moon, Sun, Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function TopNav() {
  const { t, lang, setLang } = useI18n() as any;
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const links = [
    { to: "/", label: t("nav.dashboard") || "Dashboard", icon: Sparkles, match: (p: string) => p === "/" },
    { to: "/speaking", label: t("nav.speaking"), icon: Mic, match: (p: string) => p.startsWith("/speaking") },
    { to: "/vocabulary", label: t("nav.vocab"), icon: BookOpen, match: (p: string) => p.startsWith("/vocabulary") || p.startsWith("/flashcards") },
    { to: "/history", label: t("dash.history") || "History", icon: HistoryIcon, match: (p: string) => p.startsWith("/history") },
    { to: "/settings", label: t("nav.settings"), icon: SettingsIcon, match: (p: string) => p.startsWith("/settings") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight">IELTS Speaking AI</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Band 7+ Trainer</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Primary">
          {links.map(({ to, label, icon: Icon, match }) => {
            const active = match(path);
            return (
              <Link
                key={to}
                to={to as any}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLang(lang === "en" ? "vi" : "en")}
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            <span className="sr-only">Lang</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-1 px-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {(user.email || "U").charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                  <SettingsIcon className="h-4 w-4" /> {t("nav.settings")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" /> {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate({ to: "/auth" })}>
              {t("auth.signin")}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="md:hidden border-t border-border overflow-x-auto" aria-label="Mobile primary">
        <div className="mx-auto max-w-7xl px-2 flex items-center gap-1 py-2">
          {links.map(({ to, label, icon: Icon, match }) => {
            const active = match(path);
            return (
              <Link
                key={to}
                to={to as any}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
