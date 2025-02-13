import "i18next";

import enCommon from "./i18n/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: { common: typeof enCommon };
  }
}
