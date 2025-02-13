import { useLocalStorage } from "@mantine/hooks";

export const useProgressStorage = () => {
  const [progress, setProgress] = useLocalStorage<Record<string, boolean>>({
    key: "progress",
    defaultValue: {},
  });
  const updateProgress = (id: string | number, value: boolean) => {
    if (value) {
      setProgress((prev) => ({ ...prev, [id]: true }));
    } else {
      const { [id]: _, ...rest } = progress;
      setProgress(rest);
    }
  };
  const resetProgress = () => setProgress({});

  return [progress, updateProgress, resetProgress] as const;
};

export const useGeolocationFirstTimeNoticeStorage = () => {
  const [geolocationFirstTimeNotice, setGeolocationFirstTimeNotice] =
    useLocalStorage<boolean>({
      key: "geolocationFirstTimeNotice",
      defaultValue: true,
    });

  return [geolocationFirstTimeNotice, setGeolocationFirstTimeNotice] as const;
};
