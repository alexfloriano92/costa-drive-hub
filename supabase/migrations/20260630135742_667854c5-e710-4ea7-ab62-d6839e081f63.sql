
CREATE POLICY "public read vehicle images" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-images');
CREATE POLICY "admins upload vehicle images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update vehicle images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete vehicle images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
