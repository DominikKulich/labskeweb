-- roles
create type public.app_role as enum ('admin', 'editor', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read own roles" on public.user_roles
for select to authenticated using (user_id = auth.uid());
create policy "Admins manage roles" on public.user_roles
for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- updated_at helper
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- photos
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  description text,
  source text,
  author text,
  category text not null default 'historie',
  image_url text not null,
  published boolean not null default false,
  sort_order integer not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.photos to anon;
grant select, insert, update, delete on public.photos to authenticated;
grant all on public.photos to service_role;
alter table public.photos enable row level security;
create policy "Public can read published photos" on public.photos
for select to anon, authenticated using (published = true);
create policy "Admins read all photos" on public.photos
for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins insert photos" on public.photos
for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "Admins update photos" on public.photos
for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete photos" on public.photos
for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger update_photos_updated_at before update on public.photos
for each row execute function public.update_updated_at_column();

-- articles
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  category text,
  published_at timestamptz,
  published boolean not null default false,
  reading_time integer,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.articles to anon;
grant select, insert, update, delete on public.articles to authenticated;
grant all on public.articles to service_role;
alter table public.articles enable row level security;
create policy "Public can read published articles" on public.articles
for select to anon, authenticated using (published = true);
create policy "Admins read all articles" on public.articles
for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins insert articles" on public.articles
for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "Admins update articles" on public.articles
for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete articles" on public.articles
for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger update_articles_updated_at before update on public.articles
for each row execute function public.update_updated_at_column();

-- submissions
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  approximate_year text,
  place text,
  story text not null,
  image_url text,
  upload_metadata jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.submissions to anon;
grant select, insert, update, delete on public.submissions to authenticated;
grant all on public.submissions to service_role;
alter table public.submissions enable row level security;
create policy "Anyone can submit" on public.submissions
for insert to anon, authenticated with check (true);
create policy "Admins read submissions" on public.submissions
for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update submissions" on public.submissions
for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete submissions" on public.submissions
for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger update_submissions_updated_at before update on public.submissions
for each row execute function public.update_updated_at_column();

-- demo seed (clearly marked as demo)
insert into public.photos (title, year, description, source, author, category, image_url, published, sort_order, is_demo) values
('Přívoz u dolního břehu','1954','Přívozní prám odvážel dělníky na druhý břeh čtyřikrát za hodinu.','Archivní snímek','neznámý autor','historie','/demo/privoz.jpg',true,10,true),
('Pilíře nového mostu','1971','Betonáž prvního pilíře na podzim roku 1971.','Archiv stavby','reprodukce','promeny','/demo/most-stavba.jpg',true,20,true),
('Plovárna na Ostrově','1966','Dřevěné molo plovárny bývalo v létě obsazené od rána.','Rodinné album','soukromá sbírka','historie','/demo/plovarna.jpg',true,30,true),
('Promenáda po revitalizaci','2024','Nová dlážděná promenáda s alejí a lavičkami vedoucí k mostu.','Redakce projektu','redakce','soucasnost','/demo/dnes.jpg',true,40,true),
('Ranní mlha nad řekou','2022','Listopadové ráno u loděnice.','Redakce projektu','redakce','labe','/demo/labe-mlha.jpg',true,50,true);

insert into public.articles (title, slug, excerpt, content, cover_image_url, category, published_at, published, reading_time, is_demo) values
('Jak vznikal nový most přes Labe','jak-vznikal-novy-most-pres-labe','Tři roky stavby, dvě povodně a jedna generace, která si zvykla, že se na druhý břeh chodí pěšky.','Než se přes Labe přehnal první betonový oblouk, musel se změnit celý spodní okraj města.','/demo/most-stavba.jpg','Proměny','2025-03-18T00:00:00Z',true,7,true),
('Přívoz, který spojoval oba břehy','privoz-ktery-spojoval-oba-brehy','Sto let jízd tam a zpět, jízdenky za pár haléřů a převozníci, kteří znali každého cestujícího jménem.','Přívoz byl po většinu dvacátého století nejsamozřejmější věcí na nábřeží.','/demo/privoz.jpg','Historie','2025-01-27T00:00:00Z',true,5,true),
('Plovárna na Ostrově','plovarna-na-ostrove','Dřevěné molo, půjčovna loděk a letní odpoledne, která si pamatuje ještě několik generací.','Plovárna vznikla mezi válkami jako prosté dřevěné molo s kabinami.','/demo/plovarna.jpg','Život u řeky','2024-11-09T00:00:00Z',true,6,true);