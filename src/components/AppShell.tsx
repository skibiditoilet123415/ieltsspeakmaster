import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-border py-6 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} IELTS Speaking AI Trainer</div>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/legal/cookies" className="hover:text-foreground">Cookies</Link>
            <Link to="/legal/refund" className="hover:text-foreground">Refund</Link>
            <Link to="/legal/disclaimer" className="hover:text-foreground">Disclaimer</Link>
            <a href="mailto:nguyenthienbaoflo@gmail.com" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
