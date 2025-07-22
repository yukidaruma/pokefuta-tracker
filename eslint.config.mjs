import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";

const flatCompat = new FlatCompat();

/**
 * @type {import("eslint").Linter.Config}
 */
export default fixupConfigRules(
  flatCompat.extends("next/core-web-vitals"),
  flatCompat.extends("next/typescript")
);
