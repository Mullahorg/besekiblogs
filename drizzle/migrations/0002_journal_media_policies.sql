CREATE POLICY "Public view journal media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'journal-media');
CREATE POLICY "Staff upload journal media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'journal-media' AND public.journal_has_role(auth.uid(), ARRAY['writer','editor','senior_editor','publisher','media_manager','admin','super_admin']));