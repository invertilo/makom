-- Makom schema for Supabase Postgres + PostGIS
create extension if not exists postgis;

create type place_type as enum (
  'restaurant', 'bakery', 'butcher', 'grocery_branch', 'judaica',
  'synagogue', 'mikvah', 'school', 'hotel', 'community'
);

create type kashrut_status as enum (
  'certified', 'community_report', 'unknown', 'disputed', 'closed'
);

create type food_category as enum ('meat', 'dairy', 'parve');
create type stock_category as enum ('meat', 'wine', 'matzah', 'cheese', 'frozen', 'bakery');
create type nusach as enum (
  'ashkenaz', 'sefarad', 'edot_hamizrach', 'spanish_portuguese',
  'yemenite', 'chabad', 'other'
);
create type denomination as enum ('orthodox', 'conservative', 'other');
create type orthodox_stream as enum (
  'modern', 'yeshivish', 'chabad', 'hasidic', 'sephardi', 'other'
);
create type user_role as enum ('member', 'local_moderator', 'agency', 'admin');
create type edit_status as enum ('pending', 'accepted', 'rejected');

create table agencies (
  id text primary key,
  name text not null,
  short_name text not null
);

create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_local text,
  transliteration text,
  type place_type not null,
  location geography(point, 4326) not null,
  address text not null,
  city text not null,
  country text not null,
  country_code char(2) not null,
  chain_id text,
  chain_name text,
  kashrut_status kashrut_status not null default 'unknown',
  agency_id text references agencies(id),
  food_category food_category,
  notes text,
  source text not null default 'community',
  confirmed_at timestamptz,
  phone text,
  website text,
  nusach nusach,
  denomination denomination,
  orthodox_stream orthodox_stream,
  prayer_times jsonb,
  chalav_israel boolean,
  pat_israel boolean,
  yoshon boolean,
  bishul_israel boolean,
  yayin_mevushal boolean,
  glatt boolean,
  beit_yosef boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index places_location_idx on places using gist (location);
create index places_city_idx on places (city, country_code);

create table stock_reports (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  category stock_category not null,
  note text not null,
  reported_at timestamptz not null default now(),
  confirmed_at timestamptz not null default now(),
  author_id uuid references auth.users(id),
  author_name text not null,
  confirmations int not null default 0
);

create table communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null,
  country_code char(2) not null,
  location geography(point, 4326) not null,
  area geography(polygon, 4326),
  population int,
  population_year int,
  population_source text,
  languages text[] not null default '{}',
  denomination_notes text
);

create table edit_suggestions (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  author_id uuid references auth.users(id),
  author_name text not null,
  field text not null,
  old_value text,
  new_value text not null,
  note text,
  status edit_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role user_role not null default 'member',
  denomination denomination,
  orthodox_stream orthodox_stream,
  preferred_locale text not null default 'en',
  city text,
  location geography(point, 4326),
  shabbat_mode boolean not null default false
);

create table threads (
  id uuid primary key default gen_random_uuid(),
  thread_key text not null unique,
  kind text not null check (kind in ('place', 'city')),
  place_id uuid references places(id) on delete cascade,
  city text,
  country_code char(2)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  author_name text not null,
  body text not null check (char_length(body) <= 500),
  created_at timestamptz not null default now(),
  reported boolean not null default false
);

alter table places enable row level security;
alter table stock_reports enable row level security;
alter table communities enable row level security;
alter table edit_suggestions enable row level security;
alter table messages enable row level security;
alter table profiles enable row level security;

create policy "places are public read" on places for select using (true);
create policy "communities are public read" on communities for select using (true);
create policy "stock public read" on stock_reports for select using (true);
create policy "messages public read unreporte" on messages for select using (reported = false);
create policy "authenticated insert stock" on stock_reports for insert with check (auth.role() = 'authenticated');
create policy "authenticated insert messages" on messages for insert with check (auth.uid() = author_id);
create policy "authenticated insert edits" on edit_suggestions for insert with check (auth.role() = 'authenticated');
