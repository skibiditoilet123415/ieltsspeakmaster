ALTER TABLE public.vocabulary
  ADD COLUMN IF NOT EXISTS pronunciation TEXT,
  ADD COLUMN IF NOT EXISTS cefr_level TEXT;