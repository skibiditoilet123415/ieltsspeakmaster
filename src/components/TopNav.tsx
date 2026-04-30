import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Mic, LogOut, Moon, Sun, Languages, Settings as SettingsIcon } from "lucide-react";
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
    { to: "/", label: t("nav.home") || "Home", match: (p: string) => p === "/" },
    { to: "/speaking", label: t("nav.speaking") || "Speaking", match: (p: string) => p.startsWith("/speaking") },
    { to: "/vocabulary", label: t("nav.vocab") || "Vocabulary", match: (p: string) => p.startsWith("/vocabulary") || p.startsWith("/flashcards") },
    { to: "/history", label: t("dash.history") || "History", match: (p: string) => p.startsWith("/history") },
    { to: "/settings", label: t("nav.settings") || "Settings", match: (p: string) => p.startsWith("/settings") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full pt-4 px-4">
      <div className="mx-auto max-w-6xl bg-card/95 backdrop-blur border border-border rounded-full shadow-elegant h-14 pl-4 pr-2 flex items-center gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 pr-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Mic className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:block text-sm font-extrabold tracking-tight">IELTS Speaking <span className="text-primary">Master</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="Primary">
          {links.map(({ to, label, match }) => {
            const active = match(path);
            return (
              <Link
                key={to}
                to={to as any}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 md:hidden" />

        {/* Right cluster */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={() => setLang(lang === "en" ? "vi" : "en")}
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full h-10 px-1 pr-4 flex items-center gap-2 bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90 transition">
                  <div className="h-8 w-8 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center">
                    {(user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold">
                    {t("dash.start") || "Bắt đầu"}
                  </span>
                </button>
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
            <Button
              size="sm"
              className="ml-1 rounded-full h-10 px-5 bg-gradient-primary text-primary-foreground shadow-soft"
              onClick={() => navigate({ to: "/auth" })}
            >
              {t("auth.signin") || "Bắt đầu"}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="md:hidden mx-auto max-w-6xl mt-2 overflow-x-auto" aria-label="Mobile primary">
        <div className="flex items-center gap-1 px-2 py-1">
          {links.map(({ to, label, match }) => {
            const active = match(path);
            return (
              <Link
                key={to}
                to={to as any}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
