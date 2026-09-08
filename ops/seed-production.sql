-- Safe, repeatable seed for the first production content release.
-- Legal content is intentionally excluded until the final texts are approved.

INSERT INTO hero_settings
  (id, locale, title_line1, title_line2, subtitle, primary_cta_label,
   primary_cta_href, secondary_cta_label, secondary_cta_href)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'pl', 'Poczuj rytm.', 'Żyj kulturą.',
   'Ori Craft Labs to ciepła przestrzeń, gdzie ruch, kultura i kubańsko-polskie smaki łączą się w jedno doświadczenie.',
   'Rozpocznij podróż', '/services', 'Zobacz ofertę', '/offers'),
  ('22222222-2222-4222-8222-222222222222', 'en', 'Feel the rhythm.', 'Live the culture.',
   'A warm space where Latin movement, body awareness, Cuban–Polish flavours and shared rituals become one experience.',
   'Start the journey', '/services', 'See the offers', '/offers'),
  ('33333333-3333-4333-8333-333333333333', 'es', 'Siente el ritmo.', 'Vive la cultura.',
   'Un espacio cálido donde el movimiento latino, la conciencia corporal, los sabores cubano-polacos y los rituales compartidos se convierten en una experiencia.',
   'Comienza el viaje', '/services', 'Ver ofertas', '/offers')
ON CONFLICT (locale) DO NOTHING;

INSERT INTO offers
  (id, group_name, slug, locale, title, subtitle, price_from, duration,
   includes, value, ideal_for, notes, sort_order, is_active)
VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'adults', 'adults-move-relax', 'pl',
   'Adults Move & Relax', 'Dorośli', 'od 1000 zł', 'Regularne sesje ruchowe',
   '["Ruch i świadomość ciała", "Relaksacja przy muzyce latino", "Praca w rytmie grupy"]',
   'Regularna praktyka ruchu, oddechu i regeneracji.', 'Dla dorosłych indywidualnie lub w małych grupach',
   'Oferta do dopracowania z aktualnym harmonogramem.', 10, true),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'children-youth', 'children-rhythm-lab', 'pl',
   'Children Rhythm Lab', 'Dzieci', 'od 3000 zł/mies', 'Program regularny',
   '["Rytm i ruch", "Zabawa i ekspresja", "Praca z grupą"]',
   'Regularny program rozwijający rytm, ruch i pewność siebie.', 'Dla dzieci i młodzieży',
   'Zakres i harmonogram wymagają potwierdzenia przed publikacją sprzedażową.', 20, true),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'corporate', 'corporate-wellness-day', 'pl',
   'Corporate Wellness Day', 'Firmy', 'od 2400 zł', 'Pół lub cały dzień',
   '["Ruch i oddech", "Relaksacja", "Program dopasowany do zespołu"]',
   'Dzień zdrowia i regeneracji dla zespołów.', 'Dla firm, HR i organizacji',
   'Cena zależy od zakresu i liczby uczestników.', 30, true),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'cooking-tasting', 'cooking-tasting', 'pl',
   'Cooking & Tasting', 'Smaki', 'od 390 zł/os', 'Do ustalenia',
   '["Kubańsko-polskie smaki", "Wspólne gotowanie", "Opowieści i kultura"]',
   'Kubańsko-polskie doświadczenie smaków i wspólnego stołu.', 'Dla grup prywatnych i firm',
   'Menu, termin i miejsce wymagają potwierdzenia.', 40, true),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'retreats', 'weekend-retreat', 'pl',
   'Weekend Retreat', 'Wyjazdy', 'od 13000 zł', 'Weekend',
   '["Ruch i wellness", "Kultura i rytm", "Smaki i wspólne rytuały"]',
   'Wyjazd łączący ruch, kulturę i smaki.', 'Dla grup i zespołów',
   'Program, lokalizacja i termin wymagają indywidualnego ustalenia.', 50, true)
ON CONFLICT (slug) DO NOTHING;
