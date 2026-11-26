-- Site user accounts: a profile row per signed-up user (name, phone), filled from sign-up metadata.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists prof_self on public.profiles;
create policy prof_self on public.profiles for select using (auth.uid() = id or public.my_role() in ('owner','admin'));
drop policy if exists prof_update on public.profiles;
create policy prof_update on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (new.id, new.email, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'phone')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- The project was created with "grant API access to new tables" off, so grant explicitly (RLS still decides what each role sees).
grant usage on schema public to anon, authenticated;
grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;
grant select, insert, delete on public.members to authenticated;
grant select, update on public.profiles to authenticated;
grant execute on function public.my_role() to anon, authenticated;
