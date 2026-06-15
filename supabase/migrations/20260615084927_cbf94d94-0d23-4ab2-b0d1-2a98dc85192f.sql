
-- 1) Tighten profile UPDATE: forbid self-promotion to premium
DROP POLICY IF EXISTS "own profile update" ON public.profiles;
CREATE POLICY "own profile update" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND is_premium = (SELECT p.is_premium FROM public.profiles p WHERE p.id = auth.uid())
  );

-- 2) Replace award_xp with server-computed, idempotent version
REVOKE EXECUTE ON FUNCTION public.award_xp(integer) FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.award_xp(integer);

ALTER TABLE public.speaking_sessions
  ADD COLUMN IF NOT EXISTS xp_awarded boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.award_session_xp(_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  sess RECORD;
  vocab_count integer;
  amount integer;
  prev DATE;
  new_streak INTEGER;
  new_xp INTEGER;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthenticated');
  END IF;

  SELECT id, user_id, status, xp_awarded INTO sess
  FROM public.speaking_sessions
  WHERE id = _session_id AND user_id = uid;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;
  IF sess.status <> 'completed' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_completed');
  END IF;
  IF sess.xp_awarded THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'already_awarded');
  END IF;

  SELECT COUNT(*) INTO vocab_count
  FROM public.vocabulary
  WHERE user_id = uid AND session_id = _session_id;

  IF vocab_count > 10 THEN vocab_count := 10; END IF;
  amount := 5 + vocab_count * 10;

  UPDATE public.speaking_sessions SET xp_awarded = true WHERE id = _session_id;

  SELECT last_practice_day INTO prev FROM public.profiles WHERE id = uid;
  IF prev IS NULL OR prev < CURRENT_DATE - INTERVAL '1 day' THEN
    new_streak := 1;
  ELSIF prev = CURRENT_DATE - INTERVAL '1 day' THEN
    SELECT streak_days + 1 INTO new_streak FROM public.profiles WHERE id = uid;
  ELSE
    SELECT streak_days INTO new_streak FROM public.profiles WHERE id = uid;
  END IF;

  UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + amount,
        streak_days = new_streak,
        last_practice_day = CURRENT_DATE,
        updated_at = now()
    WHERE id = uid
    RETURNING xp INTO new_xp;

  RETURN jsonb_build_object('ok', true, 'xp', new_xp, 'streak', new_streak, 'awarded', amount);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.award_session_xp(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_session_xp(uuid) TO authenticated;

-- 3) Lock down internal seeding helpers (SECURITY DEFINER) — not for client use
REVOKE EXECUTE ON FUNCTION public.seed_topic_lessons(uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_seed_topic_lessons() FROM PUBLIC, anon, authenticated;

-- 4) Server-side premium paywall on topic_lessons
DROP POLICY IF EXISTS "lessons readable by all" ON public.topic_lessons;
CREATE POLICY "lessons readable by entitled users" ON public.topic_lessons
  FOR SELECT
  USING (
    public.is_free_topic(topic_id)
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_premium = true
      )
    )
  );
