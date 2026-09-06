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
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
