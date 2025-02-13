"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./i18n/en.json";
import jaCommon from "./i18n/ja.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  supportedLngs: ["en", "ja"],
  resources: {
    ja: {
      common: jaCommon,
    },
    en: {
      common: enCommon,
    },
  },
  defaultNS: "common",
});

export default i18n;
