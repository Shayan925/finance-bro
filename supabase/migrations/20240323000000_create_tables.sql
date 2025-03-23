-- Create conversations table
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  message text not null,
  response text not null,
  timestamp timestamptz default now()
);

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  age integer,
  risk_tolerance integer,
  investment_goal text,
  investment_horizon text,
  initial_investment numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create investment_analyses table
create table if not exists investment_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  symbol text not null,
  analysis_text jsonb not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table conversations enable row level security;
alter table profiles enable row level security;
alter table investment_analyses enable row level security;

-- Create RLS policies for conversations
create policy "Users can insert their own conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own conversations"
  on conversations for select
  using (auth.uid() = user_id);

-- Create RLS policies for profiles
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create RLS policies for investment_analyses
create policy "Users can insert their own analyses"
  on investment_analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own analyses"
  on investment_analyses for select
  using (auth.uid() = user_id);

-- Create function to handle updated_at timestamp
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for profiles updated_at
create trigger handle_profiles_updated_at
  before update on profiles
  for each row
  execute function handle_updated_at(); 