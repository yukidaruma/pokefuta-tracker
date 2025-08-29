import i18next from "i18next";
import { useEffect, useState } from "react";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import { locales } from "@/i18n/constants";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, _namespace: string) =>
        import(`@/i18n/${language}.json`)
    )
  )
  .init({
    fallbackLng: false,
    supportedLngs: locales,
    defaultNS: "common",
    fallbackNS: "common",
    detection: {
      order: ["cookie", "navigator"],
    },
    preload: [],
  });

export function useTranslation(
  lng?: string,
  namespaces: Array<"common"> = ["common"],
  options = {}
) {
  const pathname = location.pathname;
  lng = pathname?.split("/")[1]!;

  const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);

  useEffect(() => {
    if (activeLng === i18next.resolvedLanguage) return;
    setActiveLng(i18next.resolvedLanguage);
  }, [activeLng, i18next.resolvedLanguage]);

  useEffect(() => {
    if (!lng || i18next.resolvedLanguage === lng) return;
    i18next.changeLanguage(lng);
  }, [lng, i18next]);

  return useTranslationOrg(namespaces, options);
}
