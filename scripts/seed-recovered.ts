import { randomUUID } from "node:crypto";
import { dbConnect } from "../src/lib/db";
import { InsightPost } from "../src/lib/models/InsightPost";
import { Event } from "../src/lib/models/Event";
import { recordAudit, recordRevision, revisionPayload } from "../src/lib/editorial";

const posts = [
  {
    slug: "kawa-muzyka-male-rytualy",
    category: "rytuały",
    title: "Kawa, muzyka i małe rytuały dla zmęczonych głów",
    excerpt: "Nie musisz uciekać od życia, żeby poczuć ulgę. Czasem wystarczy 10 minut: kawa, jedna piosenka i rytuał, który wraca do ciała.",
    content: "Są poranki, kiedy budzisz się i już jesteś spóźniony — nawet jeśli jeszcze leżysz w łóżku. Głowa odpala listę: wiadomości, spotkania, rachunki, zrób to, nie zapomnij tamtego. Ciało jest w kuchni, myśli są w jutro, a telefon próbuje Ci wmówić, że bez niego świat się zawali. Ten tekst ma dać Ci coś małego, realnego i działającego.\n\nW Orí Craft Labs lubimy duże momenty: warsztaty, wspólny ruch, muzykę, jedzenie i energię ludzi w jednym rytmie. Prawdziwe zmiany dzieją się też przy pierwszym łyku kawy, przy jednej piosence i w chwili, gdy siadasz, zanim dzień zacznie biec.\n\nKawa może być rytuałem, nie paliwem. Zanim wypijesz pierwszy łyk, weź dwa spokojne oddechy. Poczuj kubek w dłoniach. Rozluźnij szczękę. Chodzi o sposób obecności, nie o idealną metodę parzenia.\n\nZrób prosty rytuał: przez pierwsze dwie minuty przygotuj kawę bez multitaskingu, przez kolejne trzy usiądź obiema stopami na podłodze, a przez ostatnie pięć włącz jedną piosenkę i posłuchaj jej uważnie. Dziesięć minut nie naprawi całego życia, ale potrafi zmienić ton dnia. Zacznij od małego rytuału, który przypomina Ci, że Twoje życie należy do Ciebie.",
  },
  {
    slug: "od-krokow-do-swiadomosci-ciala",
    category: "świadomość ciała",
    title: "Od kroków do świadomości: jak taniec uczy Cię słuchać ciała",
    excerpt: "Kroki są alfabetem. Ale dopiero świadomość ciała sprawia, że taniec staje się rozmową — a nie testem z poprawności.",
    content: "Większość z nas zaczyna tańczyć z przyziemnych powodów. Chcemy ogarnąć podstawę, wyglądać dobrze i nie stać jak kołek na imprezie. Jeśli zostajesz w tańcu dłużej, kroki przestają być najważniejsze. Pojawiają się pytania: dlaczego barki rosną do uszu, gdy robi się szybciej? Czemu wstrzymujesz oddech, gdy uczysz się czegoś nowego?\n\nGdy celem jest poprawność, mózg robi z tańca matematykę: policz, obrót, uśmiech. Z zewnątrz wygląda to dobrze, ale w środku często jest sztywno. W tańcu nie potrzebujesz więcej kontroli. Potrzebujesz więcej słuchania.\n\nSłuchać ciała znaczy zauważać, gdzie ląduje ciężar w stopach, czy oddychasz i co robią miednica, kręgosłup oraz szczęka. Włącz jedną piosenkę. Przez 30 sekund tańcz poprawnie i staraj się. Przez kolejne 30 sekund przenoś ciężar z nogi na nogę i oddychaj normalnie. Zwykle więcej życia jest w tej drugiej połowie.\n\nW Orí Craft Labs nie jesteśmy po to, żeby zrobić z Ciebie idealnego tancerza. Pomagamy wrócić do ciała przez rytm, kulturę i praktykę, która pasuje do prawdziwego życia.",
  },
  {
    slug: "powolny-ruch-w-domu-12-minut",
    category: "ruch",
    title: "Powolny ruch w domu: 12 minut, które robią różnicę",
    excerpt: "Nie musisz robić rewolucji. Zrób 12 minut jakości. Powolny ruch to higiena układu nerwowego — nie kara za bycie człowiekiem.",
    content: "Są dwa rodzaje zmęczenia: potrzebuję snu oraz moje ciało jest jak napięty plecak, którego nie mogę zdjąć. To drugie nie zawsze znika po odpoczynku.\n\nPowolny ruch ma sens jako reset i higiena. Orí 12 to prosta praktyka domowa: przez pierwsze dwie minuty poczuj stopy i ciężar z przodu, z tyłu oraz na boki. Przez kolejne trzy minuty prowadź falę kręgosłupa bardzo wolno. Następne dwie minuty poświęć łopatkom i barkom, z miękkim oddechem. Potem rozluźnij biodra bez wymuszania, a ostatnie dwie minuty spędź w bezruchu, pytając: co się zmieniło?\n\nNajwiększy efekt polega na tym, że zauważasz napięcie wcześniej i przestajesz żyć w trybie awaryjnym. Nie naprawisz ciała, dokręcając wszystko mocniej.",
  },
  {
    slug: "rytm-jako-lekarstwo",
    category: "rytm",
    title: "Rytm jako lekarstwo: dlaczego muzyka reguluje emocje szybciej niż myślisz",
    excerpt: "Jedna piosenka potrafi zmienić nastrój szybciej niż cytat motywacyjny. To nie słabość — to biologia i rytm.",
    content: "Czy zdarzyło Ci się, że jedna piosenka zmieniła Ci nastrój szybciej niż dobra rada? To ciało robi to, do czego zostało stworzone. Jesteśmy rytmiczni: serce bije w rytmie, chód ma rytm, a stres ten rytm psuje. Oddech robi się płytki, ciało się spina, myśli przyspieszają.\n\nRytm działa, bo daje strukturę. Stałe tempo jest sygnałem bezpieczeństwa, a przewidywalność reguluje. Dlatego kołyszemy dzieci i dlatego cisza czasem nie uspokaja, tylko wzmacnia wewnętrzny hałas.\n\nSpróbuj trzech piosenek: pierwszej pasującej do Twojego stanu, drugiej stabilnej i trzeciej lekko podnoszącej, ale nie turbo. Nie przeskoczysz z chaosu do spokoju, bo układ nerwowy Ci nie uwierzy. Prowadzisz go stopniowo. Dodaj mikro-ruch: kołysanie, krok w bok albo tupnięcie. Choreografia nie jest celem. Połączenie jest celem.",
  },
  {
    slug: "kultura-codziennosci-male-gesty",
    category: "kultura",
    title: "Kultura codzienności: jak małe gesty budują bliskość (z sobą i z ludźmi)",
    excerpt: "Kultura to nie tylko festiwale. To sposób, w jaki pijesz herbatę, witasz ludzi i wracasz do ciała. Małe gesty budują więź.",
    content: "Kultura to nie tylko coś, co się odwiedza. Kultura to coś, co się robi: jak witasz ludzi, jak ustawiasz stół, jaką muzykę puszczasz, kiedy gotujesz i jak wracasz do siebie po trudnym dniu.\n\nMałe gesty, które robią różnicę, to wspólny napój przez pięć minut bez telefonu, jedna piosenka razem, prosty posiłek bez presji perfekcji i krótki spacer na rozmowę i rytm. To nie musi robić wrażenia na Instagramie, żeby robiło wrażenie na układzie nerwowym.\n\nRytuał Orí może wyglądać tak: raz w tygodniu wybierzcie po jednej piosence, zróbcie coś prostego do jedzenia, posłuchajcie dwóch piosenek bez telefonów i zadajcie jedno pytanie: co niesiesz w tym tygodniu? Niezręczność na początku jest normalna. Potem ten prosty rytuał staje się Waszą kotwicą.",
  },
];

const events = [
  { slug: "powolny-ruch-2025", category: "ruch / wellbeing", title: "Dlaczego powolny ruch może być potężniejszy niż ciężki trening", excerpt: "Warsztat, po którym wychodzisz spokojniejszy/a, mocniejszy/a i bardziej w ciele.", content: "Warsztat powolnego ruchu, oddechu i świadomości ciała. Szczegóły miejsca i dostępności potwierdzimy po zgłoszeniu.", startsAt: "2025-12-17T18:00:00+01:00", price: "89 zł" },
  { slug: "rytm-ktory-uspokaja-2025", category: "rytuały / relaks", title: "Rytm, który uspokaja: wieczór regulacji układu nerwowego", excerpt: "Muzyka, prosty ruch i oddech. Bez gadżetów i bez presji.", content: "Wieczór regulacji z muzyką, delikatnym ruchem, oddechem i herbatą. Wydarzenie pozostaje archiwalnym szkicem do aktualizacji.", startsAt: "2025-12-20T19:00:00+01:00", price: "99 zł" },
  { slug: "stretch-relax-2026", category: "relaksacja", title: "Stretch & Relax: łagodny wieczór dla kręgosłupa i bioder", excerpt: "Zero spiny. Dużo ulgi. Ruch, po którym wstajesz i czujesz: mam plecy.", content: "Łagodna mobilność, relaksacja i slow flow przy muzyce latino. Data z materiału źródłowego wymaga aktualizacji przed publikacją.", startsAt: "2026-01-10T18:00:00+01:00", price: "79 zł" },
  { slug: "children-rhythm-lab-2026", category: "dzieci", title: "Children Rhythm Lab: dzień otwarty", excerpt: "Rytm, ruch, zabawa i spokojna struktura dla dzieci 7–12 lat.", content: "Dzień otwarty dla dzieci 7–12 lat. Bez presji występowania i bez rywalizacji. Data z materiału źródłowego wymaga aktualizacji.", startsAt: "2026-01-24T11:00:00+01:00", price: "49 zł / dziecko" },
  { slug: "kuba-polska-warsztat-smakow-2026", category: "smaki / kultura", title: "Kuba + Polska: warsztat smaków i historii", excerpt: "Gotowanie, degustacja i historie, które robią most między kulturami.", content: "Kolacja z opowieścią łącząca kubańskie i polskie smaki. Data z materiału źródłowego wymaga aktualizacji.", startsAt: "2026-02-07T17:30:00+01:00", price: "169 zł" },
];

async function seedPost(post: (typeof posts)[number]) {
  const existing = await InsightPost.findOne({ slug: post.slug, locale: "pl" }).lean();
  if (existing) return;
  const created = await InsightPost.create({ id: randomUUID(), ...post, locale: "pl", status: "published", version: 1, publishedAt: new Date("2025-12-17T12:00:00Z") });
  await recordRevision({ entityType: "insight", entityId: String(created._id), locale: "pl", version: 1, status: "published", payload: revisionPayload(created), note: "Recovered from canonical website copy" });
}

async function seedEvent(event: (typeof events)[number]) {
  const existing = await Event.findOne({ slug: event.slug, locale: "pl" }).lean();
  if (existing) return;
  const created = await Event.create({ id: randomUUID(), ...event, startsAt: new Date(event.startsAt), locale: "pl", status: "draft", version: 1 });
  await recordRevision({ entityType: "event", entityId: String(created._id), locale: "pl", version: 1, status: "draft", payload: revisionPayload(created), note: "Recovered historical event; date requires owner update" });
}

async function main() {
  if (!process.argv.includes("--apply")) { console.log("Dry run. Add --apply to seed recovered Insights and historical event drafts."); return; }
  await dbConnect();
  for (const post of posts) await seedPost(post);
  for (const event of events) await seedEvent(event);
  await recordAudit({ action: "content.recovered_seed", entity: "content", metadata: { posts: posts.length, events: events.length } });
  console.log(JSON.stringify({ ok: true, posts: posts.length, events: events.length }));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
