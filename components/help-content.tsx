import * as Mantine from "@mantine/core";
import { KeyPrefix } from "i18next";

import { navItems } from "@/components/header";
import Link from "@/components/link";
import data from "@/data/data.json";
import { useTranslation } from "@/i18n/client";
import { REPO_URL } from "@/utils/constants";
import { usePathname } from "@/utils/hooks";

type PageSectionData = {
  titleKey: KeyPrefix<"common">;
  helpKey: KeyPrefix<"common">;
  tips?: Array<KeyPrefix<"common">>;
};

const HelpContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}/, "") || "/";

  const pageSection: PageSectionData[] = [
    {
      titleKey: "title_list",
      helpKey: "help_list_page",
    },
    { titleKey: "help_details_page_title", helpKey: "help_details_page" },
    { titleKey: "title_map", helpKey: "help_map_page" },
    { titleKey: "title_progress", helpKey: "help_progress_page" },
    { titleKey: "title_settings", helpKey: "help_settings_page" },
  ];

  const getCurrentPageSection = () => {
    if (pathWithoutLocale.includes("/item/")) return "help_details_page_title";
    const currentNavItem = navItems.find(
      (item) =>
        pathWithoutLocale === item.href ||
        (item.href !== "/" && pathWithoutLocale.startsWith(item.href))
    );
    return currentNavItem?.labelKey;
  };

  const currentPageTitleKey = getCurrentPageSection();

  return (
    <>
      <h3 className="text-2xl text-red-700 font-bold">{t("about")}</h3>
      <p className="mt-2">
        {t("about_description", { count: data.list.length })}
      </p>

      <p className="mt-4 text-xs text-gray-600">
        {t("last_updated_at")}:{" "}
        {new Date(import.meta.env.VITE_PUBLIC_BUILD_DATE!).toLocaleString()}{" "}
        (rev:{" "}
        {import.meta.env.VITE_PUBLIC_GIT_COMMIT_SHA === "unknown" ? (
          "unknown"
        ) : (
          <a
            href={`${REPO_URL}/commit/${import.meta.env.VITE_PUBLIC_GIT_COMMIT_SHA!.substring(
              0,
              7
            )}`}
            target="_blank"
          >
            {import.meta.env.VITE_PUBLIC_GIT_COMMIT_SHA!.substring(0, 7)}
          </a>
        )}
        )
      </p>

      <h3 className="mt-6 text-2xl text-red-700 font-bold">
        {t("page_descriptions")}
      </h3>
      <div className="mt-4 space-y-2">
        {pageSection.map(({ titleKey, helpKey, tips }) => {
          const navItem = navItems.find((item) => item.labelKey === titleKey);
          const href = navItem ? navItem.href : null;

          return (
            <div key={titleKey}>
              <h4 className="text-lg font-semibold text-red-700">
                {href ? (
                  <Link
                    href={href}
                    className="hover:underline"
                    onClick={onClose}
                  >
                    {t(titleKey as any)}
                  </Link>
                ) : (
                  t(titleKey as any)
                )}
                {titleKey === currentPageTitleKey && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({t("current_page")})
                  </span>
                )}
              </h4>
              <p>{t(helpKey as any)}</p>
              {tips?.map((tipKey) => (
                <p key={tipKey} className="text-gray-700">
                  {t(tipKey as any)}
                </p>
              ))}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Mantine.Button onClick={onClose} color="gray">
          {t("close_help")}
        </Mantine.Button>
      </div>
    </>
  );
};

export default HelpContent;
