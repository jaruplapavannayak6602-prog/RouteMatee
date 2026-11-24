-- Run in Supabase SQL Editor. Enable Supabase Auth providers in the dashboard.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  phone_verified boolean not null default false,
  email_verified boolean not null default false,
  bio text check (char_length(bio) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.journey_kind as enum ('now', 'scheduled', 'commute');
create type public.journey_status as enum ('open', 'full', 'cancelled', 'completed');

create table if not exists public.journeys (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  pickup_label text not null,
  destination_label text not null,
  -- Add geocoded coordinates in a later migration for geospatial route matching.
  departure_at timestamptz not null,
  journey_type public.journey_kind not null default 'scheduled',
  seats_available integer not null default 1 check (seats_available between 1 and 4),
  recurring_days smallint[] default '{}',
  notes text check (char_length(notes) <= 500),
  status public.journey_status not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.journey_requests (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  message text check (char_length(message) <= 500),
  status text not null default 'pending' check (status in ('pending','accepted','declined','withdrawn')),
  created_at timestamptz not null default now(),
  unique (journey_id, requester_id)
);

alter table public.profiles enable row level security;
alter table public.journeys enable row level security;
alter table public.journey_requests enable row level security;

-- Users can view limited profile fields only after you define a public profile view.
-- Direct profile reads are restricted to the owner by default.
create policy "profile owner can read" on public.profiles
  for select using (auth.uid() = id);
create policy "profile owner can insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profile owner can update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "signed-in users can view open journeys" on public.journeys
  for select to authenticated using (status = 'open' or owner_id = auth.uid());
create policy "owners can create journeys" on public.journeys
  for insert to authenticated with check (owner_id = auth.uid());
create policy "owners can update journeys" on public.journeys
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners can delete journeys" on public.journeys
  for delete to authenticated using (owner_id = auth.uid());

create policy "requester can create request" on public.journey_requests
  for insert to authenticated with check (requester_id = auth.uid());
create policy "participants can view requests" on public.journey_requests
  for select to authenticated using (
    requester_id = auth.uid() or exists (
      select 1 from public.journeys j
      where j.id = journey_id and j.owner_id = auth.uid()
    )
  );
create policy "participants can update request" on public.journey_requests
  for update to authenticated using (
    requester_id = auth.uid() or exists (
      select 1 from public.journeys j
      where j.id = journey_id and j.owner_id = auth.uid()
    )
  );

create index if not exists journeys_departure_idx on public.journeys (departure_at);
create index if not exists journeys_owner_idx on public.journeys (owner_id);
create index if not exists journey_requests_journey_idx on public.journey_requests (journey_id);
