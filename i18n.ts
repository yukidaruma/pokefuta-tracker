import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";

import enCommon from "@/i18n/en.json";
import jaCommon from "@/i18n/ja.json";
import { fallbackLng, locales } from "@/i18n/constants";

async function initTranslations(locale: string, namespaces: string[]) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, _namespace: string) =>
          import(`@/i18n/${language}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng,
      supportedLngs: locales,
      defaultNS: "common",
      fallbackNS: "common",
      ns: namespaces,
      resources: {
        ja: {
          common: jaCommon,
        },
        en: {
          common: enCommon,
        },
      },
      preload: [],
    });

  return i18nInstance;
}

export async function useTranslation(locale: string, namespaces?: string[]) {
  const i18nextInstance = await initTranslations(
    locale,
    namespaces ?? ["common"]
  );
  return {
    t: i18nextInstance.getFixedT(locale, "common"),
    i18n: i18nextInstance,
  };
}
