-- Illustratieve trainingsinschrijvingen per gebruikersaccount (ronde 17).
CREATE TABLE public.training_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  training_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, training_id)
);
GRANT SELECT, INSERT, DELETE ON public.training_enrollments TO authenticated;
GRANT ALL ON public.training_enrollments TO service_role;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own enrollments read" ON public.training_enrollments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own enrollments insert" ON public.training_enrollments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own enrollments delete" ON public.training_enrollments FOR DELETE TO authenticated USING (user_id = auth.uid());
