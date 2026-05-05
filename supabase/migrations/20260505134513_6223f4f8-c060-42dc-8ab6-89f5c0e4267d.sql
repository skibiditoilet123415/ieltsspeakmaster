-- 1) Lessons table: 5 lessons per topic
CREATE TABLE public.topic_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  position smallint NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (topic_id, position)
);

ALTER TABLE public.topic_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lessons readable by all"
  ON public.topic_lessons FOR SELECT
  USING (true);

CREATE INDEX idx_topic_lessons_topic ON public.topic_lessons(topic_id, position);

-- 2) Helper function: is a given topic free? (first 4 by difficulty,title)
CREATE OR REPLACE FUNCTION public.is_free_topic(_topic_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM (
      SELECT id FROM public.topics
      ORDER BY difficulty ASC, title ASC
      LIMIT 4
    ) t WHERE t.id = _topic_id
  );
$$;

-- 3) Auto-seed 5 lessons for every existing topic AND any future topic
CREATE OR REPLACE FUNCTION public.seed_topic_lessons(_topic_id uuid, _title text, _category text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.topic_lessons (topic_id, position, kind, title, body) VALUES
  (_topic_id, 1, 'vocabulary',
   'Key Vocabulary',
   'Learn 8–10 essential words and collocations related to "' || _title || '". Focus on band 7+ vocabulary you can naturally fit into your answers. Try to use each new word in your own example sentence.'),
  (_topic_id, 2, 'sample',
   'Sample Band 8 Answer',
   'Read a model answer for "' || _title || '" written at Band 8 level. Notice the structure: opening statement → reason → specific example → closing reflection. Pay attention to linking phrases like "to be honest", "what really stands out is", and "as a result".'),
  (_topic_id, 3, 'practice',
   'Practice Q&A',
   'Answer 5 follow-up questions related to "' || _title || '". Speak for 30–45 seconds per question. Record yourself and listen for hesitations, repeated words, and grammar slips.'),
  (_topic_id, 4, 'tips',
   'Strategy & Tips',
   'Strategies specific to ' || _category || ' topics: (1) avoid one-word answers, (2) extend with WHY/HOW/EXAMPLE, (3) use varied tenses, (4) sprinkle 1–2 idiomatic expressions, (5) end with a personal opinion.'),
  (_topic_id, 5, 'mock',
   'Mock Test',
   'Run a full simulated speaking session on "' || _title || '" with the AI examiner. Aim for natural pacing, accurate grammar, and topic-appropriate vocabulary. Get instant band feedback after.')
  ON CONFLICT (topic_id, position) DO NOTHING;
END;
$$;

-- Seed for all existing topics
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id, title, category FROM public.topics LOOP
    PERFORM public.seed_topic_lessons(r.id, r.title, r.category);
  END LOOP;
END $$;

-- Trigger: auto-seed when a new topic is added
CREATE OR REPLACE FUNCTION public.tg_seed_topic_lessons()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.seed_topic_lessons(NEW.id, NEW.title, NEW.category);
  RETURN NEW;
END;
$$;

CREATE TRIGGER topics_seed_lessons_after_insert
AFTER INSERT ON public.topics
FOR EACH ROW EXECUTE FUNCTION public.tg_seed_topic_lessons();