import { isLocale, type Locale } from "@/lib/i18n";

const localizedSections = new Set([
  "services",
  "offers",
  "insights",
  "about",
  "contact",
  "history",
  "faq",
  "partners",
  "legal",
  "privacy",
  "terms",
  "cookies",
  "cookie-preferences",
]);

export function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  return isLocale(firstSegment) ? firstSegment : "pl";
}

function localeHome(locale: Locale) {
  return locale === "pl" ? "/" : `/${locale}`;
}

export function localizedPath(path: string, locale: Locale): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return localeHome(locale);
  const [section, ...rest] = segments;
  if (!localizedSections.has(section)) return localeHome(locale);
  if (section === "insights" && rest.length > 0 && locale !== "pl") {
    return `/${locale}/insights`;
  }
  const pathname = `/${segments.join("/")}`;
  return locale === "pl" ? pathname : `/${locale}${pathname}`;
}

/** Keep the current section when it exists in the requested locale. */
export function localizedHref(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0] && isLocale(segments[0]) ? segments.shift()! : "pl";

  if (targetLocale === currentLocale) return pathname || "/";
  if (segments.length === 0) return localeHome(targetLocale);

  const [section, ...rest] = segments;
  if (!localizedSections.has(section)) return localeHome(targetLocale);

  // There is no translation-group identifier for Insights yet. Avoid sending
  // visitors to a likely 404 when the translated post uses a different slug.
  if (section === "insights" && rest.length > 0) {
    return targetLocale === "pl" ? "/insights" : `/${targetLocale}/insights`;
  }

  return localizedPath(`/${segments.join("/")}`, targetLocale);
}
