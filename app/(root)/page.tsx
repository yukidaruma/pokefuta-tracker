"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { locales } from "@/i18n/constants";
import { I18N_STORAGE_KEY } from "@/i18n/client";

const RootPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const getStoredLanguage = (): string | null => {
      const stored = localStorage.getItem(I18N_STORAGE_KEY);
      return stored && locales.includes(stored) ? stored : null;
    };

    const getBrowserLanguage = (): string | null => {
      const browserLang = navigator.language || navigator.languages?.[0];
      if (!browserLang) return locales[0];

      const exactMatch = locales.find((locale) => browserLang === locale);
      if (exactMatch) return exactMatch;

      // "en-US" -> "en"
      const langCode = browserLang.split("-")[0];
      const langMatch = locales.find((locale) => locale === langCode);
      if (langMatch) return langMatch;

      return null;
    };

    // localStorage -> Browser -> Fallback
    let lng: string;

    const storedLang = getStoredLanguage();
    if (storedLang) {
      lng = storedLang;
    } else {
      lng = getBrowserLanguage() ?? locales[0];
    }

    if (storedLang != lng) {
      localStorage.setItem(I18N_STORAGE_KEY, lng);
    }

    // Redirect to language-specific home page
    router.replace(`/${lng}`);
  }, [router]);

  // Show nothing while redirecting
  return <></>;
};

export default RootPage;
