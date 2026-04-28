import { type ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-xl px-4 pb-28 pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}
