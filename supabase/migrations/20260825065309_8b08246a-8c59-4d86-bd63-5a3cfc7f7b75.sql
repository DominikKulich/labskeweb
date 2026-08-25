create policy "Public can read images" on storage.objects for select to anon, authenticated using (bucket_id = 'images');

create policy "Admins can upload images" on storage.objects for insert to authenticated with check (
  bucket_id = 'images'
  and public.has_role(auth.uid(), 'admin')
);

create policy "Admins can delete images" on storage.objects for delete to authenticated using (
  bucket_id = 'images'
  and public.has_role(auth.uid(), 'admin')
);

-- resize existing objects to avoid orphan references