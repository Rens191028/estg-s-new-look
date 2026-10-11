CREATE TABLE public.assistant_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  session_key text NULL,
  source text NOT NULL CHECK (source IN ('widget','advisor')),
  page_context text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.assistant_conversations TO authenticated;
GRANT INSERT ON public.assistant_conversations TO anon;
GRANT ALL ON public.assistant_conversations TO service_role;
ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conversations read" ON public.assistant_conversations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own conversations insert" ON public.assistant_conversations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "guest conversations insert" ON public.assistant_conversations FOR INSERT TO anon WITH CHECK (user_id IS NULL);

CREATE TABLE public.assistant_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.assistant_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  recommended_product_ids text[] NULL,
  token_usage integer NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX assistant_messages_conv_idx ON public.assistant_messages (conversation_id, created_at);
GRANT SELECT, INSERT ON public.assistant_messages TO authenticated;
GRANT INSERT ON public.assistant_messages TO anon;
GRANT ALL ON public.assistant_messages TO service_role;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.assistant_conversation_owner(_conv uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT user_id FROM public.assistant_conversations WHERE id = _conv
$$;
CREATE OR REPLACE FUNCTION public.assistant_conversation_exists(_conv uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.assistant_conversations WHERE id = _conv)
$$;

CREATE POLICY "own messages read" ON public.assistant_messages FOR SELECT TO authenticated
  USING (public.assistant_conversation_owner(conversation_id) = auth.uid());
CREATE POLICY "own messages insert" ON public.assistant_messages FOR INSERT TO authenticated
  WITH CHECK (public.assistant_conversation_owner(conversation_id) = auth.uid());
CREATE POLICY "guest messages insert" ON public.assistant_messages FOR INSERT TO anon
  WITH CHECK (public.assistant_conversation_exists(conversation_id) AND public.assistant_conversation_owner(conversation_id) IS NULL);

CREATE TABLE public.assistant_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  content text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.assistant_knowledge TO service_role;
ALTER TABLE public.assistant_knowledge ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.compatibility_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type text NOT NULL,
  condition jsonb NOT NULL DEFAULT '{}'::jsonb,
  explanation text,
  active boolean NOT NULL DEFAULT true
);
GRANT ALL ON public.compatibility_rules TO service_role;
ALTER TABLE public.compatibility_rules ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.assistant_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.assistant_messages(id) ON DELETE CASCADE,
  rating text NOT NULL CHECK (rating IN ('up','down')),
  note text NULL
);
GRANT SELECT, INSERT ON public.assistant_feedback TO authenticated;
GRANT INSERT ON public.assistant_feedback TO anon;
GRANT ALL ON public.assistant_feedback TO service_role;
ALTER TABLE public.assistant_feedback ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.assistant_message_owner(_msg uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.user_id FROM public.assistant_messages m JOIN public.assistant_conversations c ON c.id = m.conversation_id WHERE m.id = _msg
$$;
CREATE POLICY "own feedback read" ON public.assistant_feedback FOR SELECT TO authenticated
  USING (public.assistant_message_owner(message_id) = auth.uid());
CREATE POLICY "own feedback insert" ON public.assistant_feedback FOR INSERT TO authenticated
  WITH CHECK (public.assistant_message_owner(message_id) = auth.uid());
CREATE POLICY "guest feedback insert" ON public.assistant_feedback FOR INSERT TO anon
  WITH CHECK (public.assistant_message_owner(message_id) IS NULL);

INSERT INTO public.assistant_knowledge (section, content) VALUES
('facts', 'ESTG is een Nederlandse B2B-groothandel in duurzame energieproducten, uitsluitend voor installateurs en zakelijke klanten. Assortiment: zonnepanelen, omvormers, thuisbatterijen, EV-laadpalen, warmtepompen en montagemateriaal. Meer dan 15 A-merken. Wij verkopen niet aan particulieren, alle prijzen zijn zakelijk en exclusief btw. Bestelproces: inloggen met zakelijk account, producten toevoegen aan ''Mijn Project'', bestellen vanuit het project, orderbevestiging met ordernummer. Staffelprijzen bij grotere aantallen; projectprijzen op aanvraag. Voorraad: eigen magazijn in Elst (Gelderland); bij geen voorraad noemen we de verwachte leverweek. Logistiek: vaste transportpartners Melis en Dasher; voor 15:00 besteld = dezelfde werkdag verzonden; levering op bedrijfsadres of bouwplaats in overleg. Garantie: fabrieksgarantie, ESTG is aanspreekpunt en handelt claims af; melden met SKU, ordernummer, foto''s en omschrijving. Contact: Nieuwe Aamsestraat 84A, 6662 NK Elst, Gelderland. Telefoon 085 016 7800, ma-vr 8:30-17:30, za/zo gesloten.'),
('expertise', 'Technische kennis duurzame energie. ZONNEPANELEN: opbrengst circa 0,85-0,95 kWh per Wp per jaar bij 30-40 graden helling op zuiden in Nederland; let op Vmp/Imp, Voc, temperatuurcoëfficiënt, klemzones. OMVORMERS: check altijd aantal panelen per string tegen Voc bij -10°C versus max DC-ingangsspanning, stroom per MPPT, DC/AC-verhouding (1,1-1,3 gebruikelijk), 1-fase vs 3-fase moet matchen met de aansluiting. Micro-omvormers goed bij schaduw/meerdere dakvlakken. Hybride omvormers: accu moet op de compatibiliteitslijst staan (zelfde communicatieprotocol, BMS/CAN/RS485). THUISBATTERIJEN: capaciteit (kWh) en vermogen (kW) apart beoordelen; laagspanning (48V) vs hoogspanning (HV) — HV alleen binnen eigen merkfamilie; noodstroom vraagt een backup/ATS-module. EV-LAADPALEN: 3,7kW = 1-fase, 11/22kW vraagt 3-fase aansluiting; load balancing met P1-meter voorkomt overbelasting. MONTAGE: montagesysteem moet passen bij framehoogte en klemzones van het paneel, ballastberekening bij platte daken. NORMEN: NEN 1010, NEN 7250, IEC 61215/61730, IEC 62109. Noem nooit prijzen of garantie-uitkomsten voor een individuele order — verwijs daarvoor naar de productpagina of 085 016 7800. Verzin nooit voorraad of specificaties die niet in de catalogus staan.');