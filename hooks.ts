import { useLocalStorage } from "@mantine/hooks";

export const useProgressStorage = () => {
  const [progress, setProgress] = useLocalStorage<Record<string, boolean>>({
    key: "progress",
    defaultValue: {},
  });
  const updateProgress = (id: string | number, value: boolean) => {
    setProgress((prev) => ({ ...prev, [id]: value }));
  };

  return [progress, updateProgress] as const;
};
