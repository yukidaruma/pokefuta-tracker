"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";
import { useProgressStorage } from "@/hooks";
import Copyable from "@/components/copyable";
import { notifications } from "@mantine/notifications";

const SettingsPage: React.FC = () => {
  const [importTextareaValue, setImportTextareaValue] = React.useState("");
  const [modalState, setModalState] = React.useState<
    "import" | "export" | "reset" | null
  >(null);
  const [progress, _updateProgress, resetProgress] = useProgressStorage();

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

        _updateProgress(Number(id), true);
      });
      setModalState(null);
      setImportTextareaValue("");

      notifications.show({
        message: "データをインポートしました",
      });
    } catch (e) {
      notifications.show({
        title: "エラー",
        message:
          "データのインポートに失敗しました。データの形式をお確かめの上、再度お試しください",
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
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">設定</h2>

      <h3 className="mt-4 text-2xl text-red-700 font-bold">データ管理</h3>
      <div className="mt-2 flex space-x-6">
        <Mantine.Button
          leftSection={<Lucide.ArrowBigDown size={24} />}
          onClick={() => setModalState("import")}
        >
          インポート
        </Mantine.Button>
        <Mantine.Button
          leftSection={<Lucide.ArrowBigUp size={24} />}
          onClick={() => setModalState("export")}
        >
          エクスポート
        </Mantine.Button>
      </div>

      <Mantine.Button
        className="mt-6"
        color="red"
        leftSection={<Lucide.X size={24} />}
        onClick={() => setModalState("reset")}
      >
        リセット
      </Mantine.Button>

      <Mantine.Modal
        opened={modalState === "import"}
        onClose={() => setModalState(null)}
        title={<span className="font-bold">データのインポート</span>}
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
          インポートする
        </Mantine.Button>
      </Mantine.Modal>
      <Mantine.Modal
        opened={modalState === "export"}
        onClose={() => setModalState(null)}
        title={<span className="font-bold">データのエクスポート</span>}
      >
        <Mantine.Textarea
          onClick={(e) => e.currentTarget.select()}
          value={serializedData}
          readOnly
        />
        <Copyable
          value={serializedData}
          copyMessage="データをコピーしました"
          button={
            <Mantine.Button
              leftSection={<Lucide.Copy />}
              className="mt-4"
              w="100%"
            >
              コピーする
            </Mantine.Button>
          }
        />
      </Mantine.Modal>
      <Mantine.Modal
        opened={modalState === "reset"}
        onClose={() => setModalState(null)}
        title={<span className="font-bold">データのリセット</span>}
      >
        <p>
          データをリセットすると、すべてのポケふたの訪問状況が失われます。一度リセットしたデータを元に戻すことはできません。
        </p>
        <p className="mt-2">本当にデータをリセットしますか？</p>

        <div className="mt-6 flex justify-between">
          <Mantine.Button color="black" onClick={() => setModalState(null)}>
            キャンセル
          </Mantine.Button>
          <Mantine.Button color="red" onClick={onClickReset}>
            リセットする
          </Mantine.Button>
        </div>
      </Mantine.Modal>
    </div>
  );
};

export default SettingsPage;
