import React from "react";

import MantineModal from "@/components/modal";
import { useTranslation } from "@/i18n/client";
import { useGeolocationFirstTimeNoticeStorage } from "@/utils/hooks";

type GeolocationContextProps = {
  latitude: number | null;
  longitude: number | null;
  error: GeolocationPositionError | null;
  getGeolocation: () => void;
};

const GeolocationContext = React.createContext<GeolocationContextProps>({
  latitude: null,
  longitude: null,
  error: null,
  getGeolocation: () => {},
});

const GeolocationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [error, setError] = React.useState<GeolocationPositionError | null>(
    null
  );
  const [firstTimeNotice, setFirstTimeNotice] =
    useGeolocationFirstTimeNoticeStorage();

  const getGeolocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
        setFirstTimeNotice(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        setFirstTimeNotice(false);
      }
    );
  };

  return (
    <>
      <MantineModal opened={loading && firstTimeNotice} onClose={() => {}}>
        <p>{t("geolocation_notice")}</p>

        <p className="mt-4">{t("geolocation_notice_privacy")}</p>
      </MantineModal>
      <MantineModal
        opened={Boolean(error)}
        onClose={() => {
          setError(null);
        }}
      >
        <p>{t("geolocation_error")}</p>
      </MantineModal>

      <GeolocationContext.Provider
        value={{
          latitude,
          longitude,
          error,
          getGeolocation,
        }}
      >
        {children}
      </GeolocationContext.Provider>
    </>
  );
};

const useGeolocationContext = () => React.useContext(GeolocationContext);

export { GeolocationContext, GeolocationProvider, useGeolocationContext };
