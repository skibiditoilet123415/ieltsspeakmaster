-- Lock down SECURITY DEFINER functions: revoke broad EXECUTE, grant only where needed.

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_seed_topic_lessons() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.seed_topic_lessons(uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_free_topic(uuid) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.award_xp(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_xp(integer) TO authenticated;

REVOKE ALL ON FUNCTION public.consume_daily_test() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_daily_test() TO authenticated;
