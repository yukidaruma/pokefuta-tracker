"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";
import { notifications } from "@mantine/notifications";

import Copyable from "@/components/copyable";
import { useTranslation } from "@/i18n-client";
import { useSearchContext } from "@/providers/search";

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [importTextareaValue, setImportTextareaValue] = React.useState("");
  const [modalState, setModalState] = React.useState<
    "import" | "export" | "reset" | null
  >(null);
  const { progress, updateProgress, resetProgress } = useSearchContext();

  const exportedData = {
    progress: Object.keys(progress).join(","),
  };
  const serializedData = React.useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : window.btoa(JSON.stringify(exportedData)),
    [exportedData]
  );

  const onClickImport = () => {
    try {
      const data = JSON.parse(window.atob(importTextareaValue)) as {
        progress?: string;
      };
      resetProgress();
      data.progress?.split(",").forEach((id: string) => {
        if (!id) {
          return;
        }

        updateProgress(Number(id), true);
      });
      setModalState(null);
      setImportTextareaValue("");

      notifications.show({
        message: t("import_success"),
      });
    } catch (e) {
      notifications.show({
        title: t("error"),
        message: t("import_error"),
        color: "red",
        autoClose: 5000,
      });
    }
  };
  const onClickReset = () => {
    localStorage.clear();
    location.reload();
  };
  const onChangeLanguage = (
    language: string | null, // Actually language is always non-null
    _option: Mantine.ComboboxItem
  ) => {
    i18n.changeLanguage(language!);
    router.push(`/${language}/settings`);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">
        {t("title_settings")}
      </h2>

      <h3 className="mt-4 text-2xl text-red-700 font-bold">
        {t("manage_data")}
      </h3>
      <div className="mt-2 flex space-x-6">
        <Mantine.Button
          leftSection={<Lucide.ArrowBigDown size={24} />}
          onClick={() => setModalState("import")}
        >
          {t("import")}
        </Mantine.Button>
        <Mantine.Button
          leftSection={<Lucide.ArrowBigUp size={24} />}
          onClick={() => setModalState("export")}
        >
          {t("export")}
        </Mantine.Button>
      </div>

      <Mantine.Button
        className="mt-6"
        color="red"
        leftSection={<Lucide.X size={24} />}
        onClick={() => setModalState("reset")}
      >
        {t("reset")}
      </Mantine.Button>

      <Mantine.Modal
        opened={modalState === "import"}
        onClose={() => setModalState(null)}
        title={<span className="font-bold">{t("import_data")}</span>}
      >
        <Mantine.Textarea
          onChange={(e) => setImportTextareaValue(e.currentTarget.value)}
          value={importTextareaValue}
        />
        <Mantine.Button
          leftSection={<Lucide.Upload />}
          className="mt-4"
          w="100%"
          onClick={onClickImport}
          disabled={importTextareaValue.trim() === ""}
        >
          {t("to_import")}
        </Mantine.Button>
      </Mantine.Modal>
      <Mantine.Modal
        opened={modalState === "export"}
        onClose={() => setModalState(null)}
        title={<span className="font-bold">{t("export_data")}</span>}
      >
        <Mantine.Textarea
          onClick={(e) => e.currentTarget.select()}
          value={serializedData}
          readOnly
        />
        <Copyable
          value={serializedData}
          copyMessage={t("export_success_copy")}
          button={
            <Mantine.Button
              leftSection={<Lucide.Copy />}
              className="mt-4"
              w="100%"
            >
              {t("to_copy")}
            </Mantine.Button>
          }
        />
      </Mantine.Modal>
      <Mantine.Modal
        opened={modalState === "reset"}
        onClose={() => setModalState(null)}
        title={<span className="font-bold">{t("reset_data")}</span>}
      >
        <p>{t("reset_warning")}</p>
        <p className="mt-2">{t("reset_confirmation")}</p>

        <div className="mt-6 flex justify-between">
          <Mantine.Button color="black" onClick={() => setModalState(null)}>
            {t("cancel")}
          </Mantine.Button>
          <Mantine.Button color="red" onClick={onClickReset}>
            {t("to_reset")}
          </Mantine.Button>
        </div>
      </Mantine.Modal>

      <h3 className="mt-4 text-2xl text-red-700 font-bold">{t("language")}</h3>
      <Mantine.Select
        maw={300}
        defaultValue={i18n.language}
        onChange={onChangeLanguage}
        data={[
          { value: "en", label: "English / 英語" },
          { value: "ja", label: "Japanese / 日本語" },
        ]}
        allowDeselect={false}
      />

      <hr className="my-6" />
      <h3 className="mt-4 text-2xl text-red-700 font-bold">{t("tips")}</h3>
      <ul className="list-disc pl-6">
        <li>{t("tip_1")}</li>
      </ul>
    </div>
  );
};

export default SettingsPage;
