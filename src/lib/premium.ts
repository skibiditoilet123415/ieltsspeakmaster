import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const FREE_TOPIC_LIMIT = 4;
export const PREMIUM_PRICE_VND = 200000;
export const PREMIUM_PRICE_LABEL = "200.000 ₫";

export function useIsPremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsPremium(false); setLoading(false); return; }
    let cancelled = false;
    supabase.from("profiles").select("is_premium").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setIsPremium(Boolean(data?.is_premium));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  return { isPremium, loading };
}

/** Returns the set of topic IDs that are free (first FREE_TOPIC_LIMIT by difficulty,title). */
export function freeTopicIds(topics: Array<{ id: string; title: string; difficulty: number }>) {
  const sorted = [...topics].sort((a, b) =>
    a.difficulty - b.difficulty || a.title.localeCompare(b.title)
  );
  return new Set(sorted.slice(0, FREE_TOPIC_LIMIT).map((t) => t.id));
}
