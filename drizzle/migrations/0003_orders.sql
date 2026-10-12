-- Fictieve bestellingen per gebruikersaccount (ronde 18). Geen echte betaling of vervoerder.
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  ship_date date NOT NULL,
  reference text,
  contact jsonb NOT NULL DEFAULT '{}'::jsonb,
  lines jsonb NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  shipping numeric(12,2) NOT NULL,
  vat numeric(12,2) NOT NULL,
  total numeric(12,2) NOT NULL,
  tracking_number text NOT NULL
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders read" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own orders insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
