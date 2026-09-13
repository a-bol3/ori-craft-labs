export const locales = ["pl", "en", "es"] as const;
export type Locale = (typeof locales)[number];

export const messages: Record<Locale, {
  lang: string;
  tagline: string;
  description: string;
  services: string;
  servicesText: string;
  offers: string;
  offersText: string;
  contact: string;
  about: string;
  aboutText: string;
  explore: string;
  nav: {
    services: string;
    offers: string;
    insights: string;
    about: string;
    contact: string;
    contactCta: string;
  };
  insightsPage: {
    title: string;
    empty: string;
    readMore: string;
    privatePreview: string;
    categories: Record<string, string>;
  };
}> = {
  pl: {
    lang: "pl",
    tagline: "Poczuj rytm. Żyj kulturą.",
    description: "Ciepła przestrzeń, gdzie latynoski ruch, świadomość ciała, kubańsko-polskie smaki i wspólne rytuały łączą się w jedno doświadczenie.",
    services: "Co oferujemy",
    servicesText: "Ruch, wellness, kultura i smaki zaprojektowane, by pomóc Ci odzyskać kontakt z ciałem i społecznością.",
    offers: "Pakiety i oferty",
    offersText: "Wybierz doświadczenie dla siebie, partnera lub zespołu.",
    contact: "Porozmawiajmy",
    about: "O nas",
    aboutText: "Kubańsko-polski duet łączący rytmy, emocje i codzienne rytuały.",
    explore: "Odkryj więcej",
    nav: { services: "Usługi", offers: "Oferta", insights: "Inspiracje", about: "O nas", contact: "Kontakt", contactCta: "Porozmawiajmy" },
    insightsPage: {
      title: "Aktualności",
      empty: "Brak wpisów w tej chwili. Wkrótce pojawią się tu nowe historie.",
      readMore: "Czytaj więcej",
      privatePreview: "Prywatny podgląd — ta treść nie jest widoczna dla odwiedzających.",
      categories: { movement: "Ruch", rituals: "Rytuały", "body-awareness": "Świadomość ciała", culture: "Kultura", other: "Inne" },
    },
  },
  en: {
    lang: "en",
    tagline: "Feel the rhythm. Live the culture.",
    description: "A warm space where Latin movement, body awareness, Cuban–Polish flavours and shared rituals become one experience.",
    services: "What we offer",
    servicesText: "Movement, wellness, culture and flavours designed to reconnect you with your body and community.",
    offers: "Packages and offers",
    offersText: "Choose an experience for yourself, your partner or your team.",
    contact: "Let’s talk",
    about: "About us",
    aboutText: "A Cuban–Polish duo bringing rhythms, emotions and everyday rituals together.",
    explore: "Explore more",
    nav: { services: "Services", offers: "Offers", insights: "Insights", about: "About us", contact: "Contact", contactCta: "Let’s talk" },
    insightsPage: {
      title: "Insights",
      empty: "There are no posts yet. New stories will appear here soon.",
      readMore: "Read more",
      privatePreview: "Private preview — this content is not visible to public visitors.",
      categories: { movement: "Movement", rituals: "Rituals", "body-awareness": "Body awareness", culture: "Culture", other: "Other" },
    },
  },
  es: {
    lang: "es",
    tagline: "Siente el ritmo. Vive la cultura.",
    description: "Un espacio cálido donde el movimiento latino, la conciencia corporal, los sabores cubano-polacos y los rituales compartidos se convierten en una experiencia.",
    services: "Lo que ofrecemos",
    servicesText: "Movimiento, bienestar, cultura y sabores diseñados para reconectar con tu cuerpo y tu comunidad.",
    offers: "Paquetes y experiencias",
    offersText: "Elige una experiencia para ti, tu pareja o tu equipo.",
    contact: "Hablemos",
    about: "Sobre nosotros",
    aboutText: "Un dúo cubano-polaco que une ritmos, emociones y rituales cotidianos.",
    explore: "Descubre más",
    nav: { services: "Servicios", offers: "Ofertas", insights: "Inspiración", about: "Nosotros", contact: "Contacto", contactCta: "Hablemos" },
    insightsPage: {
      title: "Historias",
      empty: "Todavía no hay publicaciones. Pronto aparecerán nuevas historias.",
      readMore: "Leer más",
      privatePreview: "Vista previa privada — este contenido no está visible para visitantes.",
      categories: { movement: "Movimiento", rituals: "Rituales", "body-awareness": "Conciencia corporal", culture: "Cultura", other: "Otros" },
    },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
