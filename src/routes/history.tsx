import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/history")({
  component: () => (
    <RequireAuth>
      <History />
    </RequireAuth>
  ),
});

function History() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("speaking_sessions").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, [user]);
  return (
    <AppShell>
      <Link to="/" className="text-sm text-muted-foreground">← Back</Link>
      <h1 className="text-xl font-bold my-4">History</h1>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sessions yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <Card key={s.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{s.topic_title || "Session"}</div>
                <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
              </div>
              <div className="text-xl font-bold text-primary">{s.overall_band ? Number(s.overall_band).toFixed(1) : "—"}</div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
