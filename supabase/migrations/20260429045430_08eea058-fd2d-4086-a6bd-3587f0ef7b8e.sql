ALTER TABLE public.topics DROP CONSTRAINT IF EXISTS topics_difficulty_check;
ALTER TABLE public.topics ADD CONSTRAINT topics_difficulty_check CHECK (difficulty BETWEEN 1 AND 9);