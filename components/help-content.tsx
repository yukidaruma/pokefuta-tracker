import * as Mantine from "@mantine/core";
import { KeyPrefix } from "i18next";
import { useTranslation } from "react-i18next";

import data from "@/data/data.json";
import { REPO_URL } from "@/utils/constants";

type ScreenSectionData = {
  titleKey: KeyPrefix<"common">;
  helpKey: KeyPrefix<"common">;
  tips?: Array<KeyPrefix<"common">>;
};

const HelpContent: React.FC = () => {
  const { t } = useTranslation();

  const screenSections: ScreenSectionData[] = [
    {
      titleKey: "title_list",
      helpKey: "help_list_page",
    },
    { titleKey: "help_details_page_title", helpKey: "help_details_page" },
    { titleKey: "title_map", helpKey: "help_map_page" },
    { titleKey: "title_progress", helpKey: "help_progress_page" },
    { titleKey: "title_settings", helpKey: "help_settings_page" },
  ];

  return (
    <>
      <h3 className="text-2xl text-red-700 font-bold">{t("about")}</h3>
      <p className="mt-2">
        {t("about_description", { count: data.list.length })}
      </p>

      <p className="mt-4 text-xs text-gray-600">
        {t("last_updated_at")}:{" "}
        {new Date(process.env.NEXT_PUBLIC_BUILD_DATE!).toLocaleString()} (rev:{" "}
        {process.env.NEXT_PUBLIC_GIT_COMMIT_SHA === "unknown" ? (
          "unknown"
        ) : (
          <a
            href={`${REPO_URL}/commit/${process.env.NEXT_PUBLIC_GIT_COMMIT_SHA!.substring(
              0,
              7
            )}`}
            target="_blank"
          >
            {process.env.NEXT_PUBLIC_GIT_COMMIT_SHA!.substring(0, 7)}
          </a>
        )}
        )
      </p>

      <h3 className="mt-6 text-2xl text-red-700 font-bold">
        {t("page_descriptions")}
      </h3>
      <div className="mt-4 space-y-2">
        {screenSections.map(({ titleKey, helpKey, tips }) => (
          <div key={titleKey}>
            <h4 className="text-lg font-semibold text-red-700">
              {t(titleKey)}
            </h4>
            <p>{t(helpKey)}</p>
            {tips?.map((tipKey) => (
              <p key={tipKey} className="text-gray-700">
                {t(tipKey)}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Mantine.ModalBaseCloseButton
          py={8}
          px={20}
          c="white"
          bg="gray"
          w="unset"
          h="2.5rem"
          icon={<></>}
        >
          {t("close_help")}
        </Mantine.ModalBaseCloseButton>
      </div>
    </>
  );
};

export default HelpContent;
