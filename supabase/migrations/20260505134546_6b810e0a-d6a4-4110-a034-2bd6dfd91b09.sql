REVOKE ALL ON FUNCTION public.seed_topic_lessons(uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_seed_topic_lessons() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_free_topic(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_free_topic(uuid) TO authenticated;