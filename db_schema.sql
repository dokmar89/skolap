-- 1. Zajištění existence tabulek
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  parent_id uuid references categories(id),
  icon text
);

create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  avatar_url text,
  role text default 'user' check (role in ('admin', 'user')),
  updated_at timestamptz default now()
);

create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  category_id uuid references categories(id),
  author_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Povolení RLS (Row Level Security)
alter table profiles enable row level security;
alter table articles enable row level security;
alter table categories enable row level security;

-- 2.1 Práva pro anon/authenticated role (nutné i při RLS)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table articles to anon, authenticated;
grant select, insert, update, delete on table categories to anon, authenticated;
grant select on table profiles to anon, authenticated;

-- 3. VYČIŠTĚNÍ STARÝCH POLITIK
drop policy if exists "Public categories are viewable by everyone" on categories;
drop policy if exists "Public articles are viewable by everyone" on articles;
drop policy if exists "Admins can do anything" on articles;
drop policy if exists "Admins can insert articles" on articles;
drop policy if exists "Admins can update articles" on articles;
drop policy if exists "Admins can delete articles" on articles;
drop policy if exists "Super Admin Insert" on articles;
drop policy if exists "Super Admin Update" on articles;
drop policy if exists "Super Admin Delete" on articles;
drop policy if exists "Users can see own profile" on profiles;
drop policy if exists "Admins can see all profiles" on profiles;


-- 4. VYTVOŘENÍ NOVÝCH, ZJEDNODUŠENÝCH POLITIK PRO INTRANET
-- Každý má přístup ke čtení.
create policy "Public view access" on categories for select using (true);
create policy "Public view access" on articles for select using (true);
create policy "Public view access" on profiles for select using (true);

-- Kdokoliv může zapisovat. Zabezpečení je nyní na straně aplikace (admin heslo).
create policy "Public write access" on articles for insert with check (true);
create policy "Public write access" on articles for update using (true);
create policy "Public write access" on articles for delete using (true);
create policy "Public write access" on categories for insert with check (true);

-- 5. ZÁKLADNÍ DATA (SEED)
-- Kategorie pro levou navigaci (pořadí: Daktela, MacOS, Windows, Tiskárny, Creatio, Hardware, Nezařazené)
DO $$
DECLARE
  cat_daktela uuid;
  cat_macos uuid;
  cat_windows uuid;
  cat_tiskarny uuid;
  cat_creatio uuid;
  cat_hardware uuid;
  cat_nezarazene uuid;
BEGIN
  INSERT INTO categories (name, parent_id, icon)
  SELECT 'Daktela', NULL, NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Daktela');
  INSERT INTO categories (name, parent_id, icon)
  SELECT 'MacOS', NULL, NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'MacOS');
  INSERT INTO categories (name, parent_id, icon)
  SELECT 'Windows', NULL, NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Windows');
  INSERT INTO categories (name, parent_id, icon)
  SELECT 'Tiskárny', NULL, NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Tiskárny');
  INSERT INTO categories (name, parent_id, icon)
  SELECT 'Creatio', NULL, NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Creatio');
  INSERT INTO categories (name, parent_id, icon)
  SELECT 'Hardware', NULL, NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Hardware');
  INSERT INTO categories (name, parent_id, icon)
  SELECT 'Nezařazené', NULL, NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Nezařazené');

  SELECT id INTO cat_daktela FROM categories WHERE name = 'Daktela' LIMIT 1;
  SELECT id INTO cat_macos   FROM categories WHERE name = 'MacOS' LIMIT 1;
  SELECT id INTO cat_tiskarny FROM categories WHERE name = 'Tiskárny' LIMIT 1;

  IF NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Daktela - hovory') AND cat_daktela IS NOT NULL THEN
    INSERT INTO articles (title, content, category_id, author_email, created_at) VALUES 
    ('Daktela - hovory', '<h2>Nastavení Daktely</h2><p>Zde najdete kompletní návod pro nastavení headsetu a přijímání hovorů...</p>', cat_daktela, 'admin@intranet', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Tiskárny - nastavení') AND cat_tiskarny IS NOT NULL THEN
    INSERT INTO articles (title, content, category_id, author_email, created_at) VALUES 
    ('Tiskárny - nastavení', '<h2>Jak přidat tiskárnu</h2><p>Postup pro přidání síťové tiskárny na pobočkách...</p>', cat_tiskarny, 'admin@intranet', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Windows na macOS') AND cat_macos IS NOT NULL THEN
    INSERT INTO articles (title, content, category_id, author_email, created_at) VALUES 
    ('Windows na macOS', '<h2>Virtualizace</h2><p>Pro uživatele Mac, kteří potřebují spouštět Windows aplikace...</p>', cat_macos, 'admin@intranet', now());
  END IF;
END $$;
