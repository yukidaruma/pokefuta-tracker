"use client";

import React from "react";
import * as Mantine from "@mantine/core";
import { useGeolocationFirstTimeNoticeStorage } from "@/hooks";

type GeolocationContextProps = {
  latitude: number | null;
  longitude: number | null;
  error: GeolocationPositionError | null;
  getGeolocation: () => void;
};

export const GeolocationContext = React.createContext<GeolocationContextProps>({
  latitude: null,
  longitude: null,
  error: null,
  getGeolocation: () => {},
});

export const GeolocationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
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
      <Mantine.Modal opened={loading && firstTimeNotice} onClose={() => {}}>
        <p>
          GPSによる位置情報を利用して周囲のポケふたを検索する場合、このアプリに位置情報の利用を許可してください。
        </p>

        <p className="mt-4">
          このアプリが使用する位置情報はすべてあなたのブラウザ内で処理され、このアプリの開発者を含む第三者にあなたの位置情報が共有されることはありません。
        </p>
      </Mantine.Modal>
      <Mantine.Modal
        opened={Boolean(error)}
        onClose={() => {
          setError(null);
        }}
      >
        <p>
          位置情報を取得できませんでした。ブラウザの位置情報の権限設定をご確認ください。
        </p>
      </Mantine.Modal>

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

export const useGeolocationContext = () => React.useContext(GeolocationContext);
