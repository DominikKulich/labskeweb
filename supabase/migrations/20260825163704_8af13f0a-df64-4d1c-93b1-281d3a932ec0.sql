CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  category text NOT NULL DEFAULT 'Dění',
  starts_at timestamptz NOT NULL DEFAULT now(),
  image_url text,
  published boolean NOT NULL DEFAULT false,
  is_demo boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published news"
  ON public.news FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can read all news"
  ON public.news FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert news"
  ON public.news FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news"
  ON public.news FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news"
  ON public.news FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.news (title, summary, category, starts_at, published, is_demo, sort_order) VALUES
('Závody v Labe aréně', 'Ukázkový obsah. O víkendu se v Labe aréně jede série závodů; nábřeží u arény bude živější než obvykle, parkování doporučujeme na okraji areálu.', 'Sport', now() - interval '2 days', true, true, 0),
('Akce ve skateparku u nábřeží', 'Ukázkový obsah. Odpolední jam pro místní jezdce s hudbou a drobným občerstvením, pro diváky volný vstup přímo z promenády.', 'Komunita', now() - interval '6 days', true, true, 0),
('Vysekaná zeleň podél promenády', 'Ukázkový obsah. Údržba posekala travnaté plochy mezi mostem a přístavištěm, průhledy na hladinu Labe jsou opět otevřené.', 'Údržba', now() - interval '12 days', true, true, 0);