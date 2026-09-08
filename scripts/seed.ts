import { dbConnect } from "../src/lib/db";
import { HeroSettings } from "../src/lib/models/HeroSettings";
import { LegalPage } from "../src/lib/models/LegalPage";

async function main() {
  if (process.argv.includes("--help") || !process.argv.includes("--apply")) {
    console.log("Safe seed. Provide --apply and production environment variables to write initial ORI content.");
    return;
  }

await dbConnect();

await HeroSettings.bulkWrite([
  {
    updateOne: {
      filter: { locale: "pl" },
      update: { $setOnInsert: { locale: "pl", titleLine1: "Poczuj rytm.", titleLine2: "Żyj kulturą.", subtitle: "Ori Craft Labs to ciepła przestrzeń, gdzie ruch, kultura i kubańsko-polskie smaki łączą się w jedno doświadczenie.", primaryCtaLabel: "Rozpocznij podróż", primaryCtaHref: "/services", secondaryCtaLabel: "Zobacz ofertę", secondaryCtaHref: "/offers" } },
      upsert: true,
    },
  },
]);

await LegalPage.bulkWrite([
  {
    updateOne: {
      filter: { slug: "privacy-policy", locale: "pl" },
      update: { $setOnInsert: { slug: "privacy-policy", locale: "pl", title: "Polityka prywatności", intro: "Informacje o przetwarzaniu danych w ORI Craft Labs.", content: "Uzupełnij i zatwierdź treść przed publikacją.", lastUpdated: new Date(), isActive: true } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "terms-of-service", locale: "pl" },
      update: { $setOnInsert: { slug: "terms-of-service", locale: "pl", title: "Regulamin świadczenia usług", intro: "Warunki korzystania z usług ORI Craft Labs.", content: "Uzupełnij i zatwierdź treść przed publikacją.", lastUpdated: new Date(), isActive: true } },
      upsert: true,
    },
  },
]);

console.log("ORI Craft Labs seed completed.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
