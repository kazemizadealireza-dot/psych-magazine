-- Run once in Supabase → SQL Editor. Replace OWNER_EMAIL below with the site owner's email first.

create table if not exists public.members (
  email text primary key,
  role text not null check (role in ('owner','admin','editor')),
  created_at timestamptz default now()
);

create table if not exists public.articles (
  id text primary key,
  title text not null,
  brief text,
  category text not null default 'self',
  minutes int default 5,
  author text, reviewer text, date text,
  cover text, thumb text,
  body text,
  refs jsonb default '[]',
  featured boolean default false,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.my_role() returns text language sql stable security definer set search_path = public as $$
  select role from public.members where email = lower(auth.jwt() ->> 'email')
$$;

alter table public.members enable row level security;
alter table public.articles enable row level security;

-- articles: everyone reads published ones; any member reads all and writes
drop policy if exists art_read on public.articles;
create policy art_read on public.articles for select using (published or public.my_role() is not null);
drop policy if exists art_write on public.articles;
create policy art_write on public.articles for all using (public.my_role() is not null) with check (public.my_role() is not null);

-- members: a member can see their own row; owner/admin see and manage everyone (nobody can add or remove an owner from the panel)
drop policy if exists mem_read on public.members;
create policy mem_read on public.members for select using (email = lower(auth.jwt() ->> 'email') or public.my_role() in ('owner','admin'));
drop policy if exists mem_insert on public.members;
create policy mem_insert on public.members for insert with check (public.my_role() in ('owner','admin') and role <> 'owner');
drop policy if exists mem_delete on public.members;
create policy mem_delete on public.members for delete using (public.my_role() in ('owner','admin') and role <> 'owner');

-- image storage
insert into storage.buckets (id, name, public) values ('images','images',true) on conflict do nothing;
drop policy if exists img_write on storage.objects;
create policy img_write on storage.objects for insert to authenticated with check (bucket_id = 'images' and public.my_role() is not null);

-- the owner
insert into public.members (email, role) values (lower('OWNER_EMAIL'), 'owner') on conflict do nothing;
