
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_band numeric(2,1) default 7.0,
  current_band numeric(2,1),
  language text not null default 'en' check (language in ('en','vi')),
  theme text not null default 'light' check (theme in ('light','dark')),
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- TOPICS (public read)
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  difficulty int not null default 6 check (difficulty between 4 and 9),
  part1_questions jsonb not null default '[]'::jsonb,
  part2_cue jsonb not null default '{}'::jsonb,
  part3_questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.topics enable row level security;
create policy "topics readable by all" on public.topics for select using (true);

-- SPEAKING SESSIONS
create table public.speaking_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  topic_title text,
  overall_band numeric(2,1),
  fluency_band numeric(2,1),
  vocabulary_band numeric(2,1),
  grammar_band numeric(2,1),
  pronunciation_band numeric(2,1),
  feedback jsonb,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.speaking_sessions enable row level security;
create policy "own sessions all" on public.speaking_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.speaking_sessions(user_id, created_at desc);

-- SESSION MESSAGES (chat transcript)
create table public.session_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.speaking_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('examiner','candidate','system')),
  content text not null,
  part text check (part in ('intro','part1','part2','part3')),
  created_at timestamptz not null default now()
);
alter table public.session_messages enable row level security;
create policy "own messages all" on public.session_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.session_messages(session_id, created_at);

-- VOCABULARY
create table public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.speaking_sessions(id) on delete set null,
  word text not null,
  meaning_en text,
  meaning_vi text,
  example text,
  synonyms text[],
  tip text,
  topic text,
  difficulty int default 6 check (difficulty between 4 and 9),
  source text default 'ai' check (source in ('ai','user','mistake')),
  -- SRS fields
  box int not null default 1 check (box between 1 and 5),
  next_review timestamptz not null default now(),
  times_seen int not null default 0,
  times_known int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.vocabulary enable row level security;
create policy "own vocab all" on public.vocabulary for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create unique index vocab_user_word_idx on public.vocabulary(user_id, lower(word));
create index on public.vocabulary(user_id, next_review);

-- FLASHCARD REVIEWS history
create table public.flashcard_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  result text not null check (result in ('know','dont_know')),
  reviewed_at timestamptz not null default now()
);
alter table public.flashcard_reviews enable row level security;
create policy "own reviews all" on public.flashcard_reviews for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- DAILY USAGE
create table public.daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  tests_count int not null default 0,
  primary key (user_id, day)
);
alter table public.daily_usage enable row level security;
create policy "own usage all" on public.daily_usage for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SEED some initial IELTS topics
insert into public.topics (title, category, difficulty, part1_questions, part2_cue, part3_questions) values
('Hometown', 'Society', 5,
 '["Where is your hometown?","What do you like most about it?","Has it changed much in recent years?","Would you recommend visitors to go there?"]'::jsonb,
 '{"prompt":"Describe a place in your hometown you enjoy visiting.","points":["Where it is","How often you go there","What you do there","And explain why you enjoy it"]}'::jsonb,
 '["Do young people in your country prefer cities or small towns?","How has urbanization affected family life?","What can governments do to make cities more livable?","Do you think rural life will disappear in the future?","How does hometown shape someone''s identity?"]'::jsonb),
('Technology in Education', 'Technology', 7,
 '["Do you use technology to study?","What apps do you find most useful?","Has technology changed the way students learn?","Do you prefer online or in-person classes?"]'::jsonb,
 '{"prompt":"Describe a piece of technology that has helped you learn something.","points":["What it is","How you use it","What you learned","And explain how it helped you"]}'::jsonb,
 '["What are the downsides of too much screen time for students?","Will traditional classrooms disappear?","How can technology help students with disabilities?","Should schools ban smartphones?","Does AI threaten or support teachers?"]'::jsonb),
('Travel', 'Travel', 6,
 '["Do you enjoy traveling?","What is your favourite kind of holiday?","Do you prefer traveling alone or with others?","What was your most memorable trip?"]'::jsonb,
 '{"prompt":"Describe a memorable journey you took.","points":["Where you went","Who you went with","What you did","And explain why it was memorable"]}'::jsonb,
 '["How has tourism changed your country?","Do people travel more now than in the past? Why?","What are the environmental impacts of tourism?","Is international travel a luxury or a necessity?","Will virtual travel replace real travel?"]'::jsonb),
('Environment', 'Environment', 7,
 '["Do you care about the environment?","What do you do to protect it?","Is pollution a big problem where you live?","Did you learn about the environment at school?"]'::jsonb,
 '{"prompt":"Describe an environmental problem that concerns you.","points":["What it is","How it affects people","What can be done","And explain why it concerns you"]}'::jsonb,
 '["Who is most responsible for protecting the environment?","Should governments fine polluters more heavily?","Can individual actions really make a difference?","What role does technology play in solving climate change?","How can we persuade companies to be greener?"]'::jsonb),
('Work and Careers', 'Work', 6,
 '["Do you work or study?","What job would you like to have in the future?","Is work-life balance important to you?","Do people in your country work long hours?"]'::jsonb,
 '{"prompt":"Describe a job you would like to do in the future.","points":["What it is","What skills it requires","How you plan to get it","And explain why you would like it"]}'::jsonb,
 '["Is it better to have one career or several in a lifetime?","How has remote work changed employment?","Should salaries be made public?","What makes a workplace attractive to young people?","Will AI replace many jobs in the future?"]'::jsonb),
('Hobbies', 'Hobbies', 5,
 '["What do you do in your free time?","Did you have a hobby when you were young?","Is it important to have a hobby?","Have your hobbies changed over time?"]'::jsonb,
 '{"prompt":"Describe a hobby you really enjoy.","points":["What it is","When you started it","How often you do it","And explain why you enjoy it"]}'::jsonb,
 '["Why are hobbies important for mental health?","Do people have less time for hobbies today?","Should schools encourage students to develop hobbies?","Are some hobbies better than others?","How do hobbies shape personality?"]'::jsonb),
('Health and Fitness', 'Health', 6,
 '["Do you exercise regularly?","What kinds of food do you consider healthy?","How important is sleep to you?","Have your health habits changed recently?"]'::jsonb,
 '{"prompt":"Describe a healthy habit you have.","points":["What the habit is","When you started it","How it makes you feel","And explain why it is important to you"]}'::jsonb,
 '["Who is responsible for people''s health — the state or the individual?","Why are some societies more obese than others?","Should junk food advertising be banned?","How has technology affected our health?","What can schools do to encourage healthier lifestyles?"]'::jsonb),
('Social Media', 'Media', 7,
 '["Do you use social media?","Which platforms do you use most?","How much time do you spend on them?","Has social media changed your relationships?"]'::jsonb,
 '{"prompt":"Describe a time social media helped you.","points":["What the situation was","Which platform you used","What happened","And explain how it helped"]}'::jsonb,
 '["How has social media changed communication?","Is social media a good or bad influence on young people?","Should social media be regulated more strictly?","Does social media threaten privacy?","Will social media look different in 10 years?"]'::jsonb),
('Food and Cooking', 'Culture', 5,
 '["Do you like cooking?","What is a typical meal in your country?","Did your parents teach you to cook?","Do you prefer eating at home or in restaurants?"]'::jsonb,
 '{"prompt":"Describe a dish you love to cook or eat.","points":["What it is","How it is made","When you usually eat it","And explain why you love it"]}'::jsonb,
 '["Why is traditional food important to a culture?","How has fast food changed eating habits?","Should schools teach cooking?","Is home-cooked food always healthier?","How has globalization changed what people eat?"]'::jsonb),
('Education', 'Education', 7,
 '["What subjects did you enjoy at school?","Do you think school days are the happiest?","Is homework important?","What makes a good teacher?"]'::jsonb,
 '{"prompt":"Describe a teacher who influenced you.","points":["Who they were","What subject they taught","What they were like","And explain how they influenced you"]}'::jsonb,
 '["Should education focus on skills or knowledge?","Are exams the best way to assess students?","Is university for everyone?","How can we make education more equal?","Will online learning replace universities?"]'::jsonb);
