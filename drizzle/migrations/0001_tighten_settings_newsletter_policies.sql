DROP POLICY IF EXISTS "Public reads settings" ON public.site_settings;
CREATE POLICY "Admins read settings" ON public.site_settings FOR SELECT TO authenticated
  USING (public.journal_has_role(auth.uid(), ARRAY['admin','super_admin']));

DROP POLICY IF EXISTS "Anyone subscribes" ON public.newsletter_subscribers;
CREATE POLICY "Anyone subscribes as pending" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND confirmed_at IS NULL
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    AND (name IS NULL OR char_length(name) <= 120)
    AND coalesce(array_length(category_preferences, 1), 0) <= 20
  );