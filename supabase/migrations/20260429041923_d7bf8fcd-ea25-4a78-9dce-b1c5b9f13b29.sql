-- Daily limit RPC
CREATE OR REPLACE FUNCTION public.consume_daily_test()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  premium BOOLEAN;
  used INTEGER;
  free_limit CONSTANT INTEGER := 2;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'unauthenticated');
  END IF;

  SELECT COALESCE(is_premium, false) INTO premium FROM public.profiles WHERE id = uid;

  INSERT INTO public.daily_usage (user_id, day, tests_count)
  VALUES (uid, CURRENT_DATE, 0)
  ON CONFLICT (user_id, day) DO NOTHING;

  SELECT tests_count INTO used FROM public.daily_usage WHERE user_id = uid AND day = CURRENT_DATE;

  IF NOT premium AND used >= free_limit THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'limit', 'used', used, 'limit', free_limit);
  END IF;

  UPDATE public.daily_usage
    SET tests_count = tests_count + 1
    WHERE user_id = uid AND day = CURRENT_DATE;

  RETURN jsonb_build_object('allowed', true, 'used', used + 1, 'limit', CASE WHEN premium THEN -1 ELSE free_limit END);
END;
$$;

CREATE OR REPLACE FUNCTION public.award_xp(amount INTEGER)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  prev DATE;
  new_streak INTEGER;
  new_xp INTEGER;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false);
  END IF;
  IF amount IS NULL OR amount < 0 OR amount > 1000 THEN
    amount := 0;
  END IF;

  SELECT last_practice_day INTO prev FROM public.profiles WHERE id = uid;

  IF prev IS NULL OR prev < CURRENT_DATE - INTERVAL '1 day' THEN
    new_streak := 1;
  ELSIF prev = CURRENT_DATE - INTERVAL '1 day' THEN
    SELECT streak_days + 1 INTO new_streak FROM public.profiles WHERE id = uid;
  ELSE
    SELECT streak_days INTO new_streak FROM public.profiles WHERE id = uid;
  END IF;

  UPDATE public.profiles
    SET xp = COALESCE(xp,0) + amount,
        streak_days = new_streak,
        last_practice_day = CURRENT_DATE,
        updated_at = now()
    WHERE id = uid
    RETURNING xp INTO new_xp;

  RETURN jsonb_build_object('ok', true, 'xp', new_xp, 'streak', new_streak, 'awarded', amount);
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_daily_test() TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_xp(integer) TO authenticated;