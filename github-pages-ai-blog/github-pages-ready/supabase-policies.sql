-- Yates Editorial OS
-- Schema and security rules for a GitHub Pages-compatible blog, AI workspace, and community chat app.
-- Run this in the Supabase SQL editor after creating your project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.rooms enable row level security;
alter table public.messages enable row level security;

-- Profiles
create policy "profiles are readable by everyone"
on public.profiles for select
using (true);

create policy "users manage their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "users update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "users delete their own profile"
on public.profiles for delete
using (auth.uid() = id);

-- Posts
create policy "published posts are public"
on public.posts for select
using (published = true or auth.uid() = author_id);

create policy "only owners create posts"
on public.posts for insert
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'owner'
  )
);

create policy "only owners update their posts"
on public.posts for update
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'owner'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'owner'
  )
);

create policy "only owners delete posts"
on public.posts for delete
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'owner'
  )
);

-- Rooms
create policy "rooms are public to read"
on public.rooms for select
using (true);

create policy "only owners create rooms"
on public.rooms for insert
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'owner'
  )
);

create policy "only owners update rooms"
on public.rooms for update
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'owner'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'owner'
  )
);

create policy "only owners delete rooms"
on public.rooms for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'owner'
  )
);

-- Messages
create policy "messages are public to read"
on public.messages for select
using (true);

create policy "signed in users create messages"
on public.messages for insert
with check (auth.uid() = author_id);

create policy "users delete their own messages"
on public.messages for delete
using (auth.uid() = author_id);

insert into public.rooms (slug, name, description)
values
  ('global', 'Global', 'Open conversation for the whole community'),
  ('prompt-lab', 'Prompt Lab', 'Discuss prompt design and model behavior'),
  ('founder-notes', 'Founder Notes', 'Longer-form strategic discussion')
on conflict (slug) do nothing;
