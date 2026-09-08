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

INSERT INTO offers
  (id, group_name, slug, locale, title, subtitle, price_from, duration,
   includes, value, ideal_for, notes, sort_order, is_active)
VALUES
  ('aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'adults', 'adults-move-relax-en', 'en',
   'Adults Move & Relax', 'Adults', 'from PLN 1000', 'Regular movement sessions',
   '["Movement and body awareness", "Relaxation with Latin music", "Group rhythm practice"]',
   'A regular practice of movement, breath and recovery.', 'Adults, individually or in small groups',
   'Offer and schedule to be confirmed before launch.', 10, true),
  ('bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'children-youth', 'children-rhythm-lab-en', 'en',
   'Children Rhythm Lab', 'Children', 'from PLN 3000/month', 'Regular programme',
   '["Rhythm and movement", "Play and expression", "Group work"]',
   'A programme that develops rhythm, movement and confidence.', 'Children and young people',
   'Scope and schedule to be confirmed before sales launch.', 20, true),
  ('ccccccc1-cccc-4ccc-8ccc-cccccccccccc', 'corporate', 'corporate-wellness-day-en', 'en',
   'Corporate Wellness Day', 'Companies', 'from PLN 2400', 'Half or full day',
   '["Movement and breath", "Relaxation", "Programme adapted to the team"]',
   'A day of health and recovery for teams.', 'Companies, HR teams and organisations',
   'Price depends on scope and number of participants.', 30, true),
  ('ddddddd1-dddd-4ddd-8ddd-dddddddddddd', 'cooking-tasting', 'cooking-tasting-en', 'en',
   'Cooking & Tasting', 'Flavours', 'from PLN 390/person', 'To be agreed',
   '["Cuban–Polish flavours", "Shared cooking", "Stories and culture"]',
   'A Cuban–Polish experience of flavours and a shared table.', 'Private and corporate groups',
   'Menu, date and venue to be confirmed.', 40, true),
  ('eeeeeee1-eeee-4eee-8eee-eeeeeeeeeeee', 'retreats', 'weekend-retreat-en', 'en',
   'Weekend Retreat', 'Retreats', 'from PLN 13000', 'Weekend',
   '["Movement and wellness", "Culture and rhythm", "Flavours and shared rituals"]',
   'A retreat combining movement, culture and flavours.', 'Groups and teams',
   'Programme, location and date require individual planning.', 50, true),
  ('aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'adults', 'adults-move-relax-es', 'es',
   'Adults Move & Relax', 'Adultos', 'desde 1000 PLN', 'Sesiones regulares de movimiento',
   '["Movimiento y conciencia corporal", "Relajación con música latina", "Práctica del ritmo en grupo"]',
   'Una práctica regular de movimiento, respiración y recuperación.', 'Adultos, individualmente o en grupos pequeños',
   'Oferta y horario por confirmar antes del lanzamiento.', 10, true),
  ('bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'children-youth', 'children-rhythm-lab-es', 'es',
   'Children Rhythm Lab', 'Niños', 'desde 3000 PLN/mes', 'Programa regular',
   '["Ritmo y movimiento", "Juego y expresión", "Trabajo en grupo"]',
   'Un programa para desarrollar el ritmo, el movimiento y la confianza.', 'Niños y jóvenes',
   'Alcance y horario por confirmar antes del lanzamiento comercial.', 20, true),
  ('ccccccc2-cccc-4ccc-8ccc-cccccccccccc', 'corporate', 'corporate-wellness-day-es', 'es',
   'Corporate Wellness Day', 'Empresas', 'desde 2400 PLN', 'Medio día o día completo',
   '["Movimiento y respiración", "Relajación", "Programa adaptado al equipo"]',
   'Un día de salud y recuperación para equipos.', 'Empresas, equipos de RR. HH. y organizaciones',
   'El precio depende del alcance y del número de participantes.', 30, true),
  ('ddddddd2-dddd-4ddd-8ddd-dddddddddddd', 'cooking-tasting', 'cooking-tasting-es', 'es',
   'Cooking & Tasting', 'Sabores', 'desde 390 PLN/persona', 'Por acordar',
   '["Sabores cubano-polacos", "Cocina compartida", "Historias y cultura"]',
   'Una experiencia cubano-polaca de sabores y mesa compartida.', 'Grupos privados y corporativos',
   'Menú, fecha y lugar por confirmar.', 40, true),
  ('eeeeeee2-eeee-4eee-8eee-eeeeeeeeeeee', 'retreats', 'weekend-retreat-es', 'es',
   'Weekend Retreat', 'Retiros', 'desde 13000 PLN', 'Fin de semana',
   '["Movimiento y bienestar", "Cultura y ritmo", "Sabores y rituales compartidos"]',
   'Un retiro que combina movimiento, cultura y sabores.', 'Grupos y equipos',
   'El programa, la ubicación y la fecha requieren planificación individual.', 50, true)
ON CONFLICT (slug) DO NOTHING;
