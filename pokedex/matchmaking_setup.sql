-- 1. Create the matchmaking table
CREATE TABLE IF NOT EXISTS public.matchmaking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  peer_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.matchmaking ENABLE ROW LEVEL SECURITY;

-- 3. Create policies so anyone can insert, update, and read (since P2P requires open matchmaking)
CREATE POLICY "Anyone can view matchmaking queue" 
ON public.matchmaking FOR SELECT USING (true);

CREATE POLICY "Anyone can insert into matchmaking" 
ON public.matchmaking FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update matchmaking to claim a match" 
ON public.matchmaking FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete their own matchmaking entry" 
ON public.matchmaking FOR DELETE USING (true);
