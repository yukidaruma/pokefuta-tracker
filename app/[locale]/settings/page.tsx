"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";
import { notifications } from "@mantine/notifications";

import Copyable from "@/components/copyable";
import { useSearchContext } from "@/providers/search";
import { useTranslation } from "react-i18next";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation("common");

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

  return (
    <div>
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
    </div>
  );
};

export default SettingsPage;
