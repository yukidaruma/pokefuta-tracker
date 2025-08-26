import { Metadata } from "next";
import { locales } from "@/i18n/constants";

interface GenerateAlternatesOptions {
  pathname: string;
}

export function generateAlternates({
  pathname,
}: GenerateAlternatesOptions): Metadata["alternates"] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  let finalPath = pathWithoutLocale;
  if (finalPath.endsWith("/")) {
    finalPath = finalPath.substring(0, finalPath.length - 1);
  }

  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${baseUrl}/${locale}${finalPath}`])
    ),
  };
}
