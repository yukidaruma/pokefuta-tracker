import React from "react";

interface MapCenterContextProps {
  latitude: number | null;
  longitude: number | null;
  setCoordinates: (latitude: number, longitude: number) => void;
}

const MapCenterContext = React.createContext<MapCenterContextProps>({
  latitude: null,
  longitude: null,
  setCoordinates: () => {},
});

const MapCenterProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);

  const setCoordinates = React.useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  return (
    <MapCenterContext.Provider value={{ latitude, longitude, setCoordinates }}>
      {children}
    </MapCenterContext.Provider>
  );
};

const useMapCenterContext = () => React.useContext(MapCenterContext);

export { MapCenterContext, MapCenterProvider, useMapCenterContext };
