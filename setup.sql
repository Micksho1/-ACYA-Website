-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste this in → Run)

create extension if not exists "uuid-ossp";

create table if not exists gallery_images (
  id uuid primary key default uuid_generate_v4(),
  title text,
  caption text,
  image_url text not null,
  event_type text,
  created_at timestamptz default now()
);

-- If you already ran this script before adding the "event" dropdown to the
-- admin page, run just this one line to add the new column to your existing table:
-- alter table gallery_images add column if not exists event_type text;

alter table gallery_images enable row level security;

-- Anyone visiting the site can view the gallery photos
create policy "Public can view gallery images"
on gallery_images for select
using (true);

-- Only a signed-in admin can add a new photo
create policy "Signed-in users can insert gallery images"
on gallery_images for insert
to authenticated
with check (true);

-- Only a signed-in admin can remove a photo
create policy "Signed-in users can delete gallery images"
on gallery_images for delete
to authenticated
using (true);

-- After creating a Storage bucket named "gallery-photos" (Public bucket = ON)
-- in the dashboard, run this too so only a signed-in admin can upload/delete files in it:

create policy "Signed-in users can upload photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'gallery-photos');

create policy "Signed-in users can delete photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'gallery-photos');
