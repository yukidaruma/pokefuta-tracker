"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";

import MapComponent, { MapComponentHandle } from "@/components/map";
import PokefutasNearby from "@/components/pokefutas-nearby";
import { useProgressStorage } from "@/hooks";
import {
  GeolocationContext,
  GeolocationProvider,
  useGeolocationContext,
} from "@/providers/geolocation";
import { MapCenterContext, MapCenterProvider } from "@/providers/map-center";
import { getFilteredPokefutas } from "@/util";
import { SearchContext } from "@/providers/search";

const MapPage = () => {
  const [geolocationGen, setGeolocationGen] = React.useState(0);
  const [progress, _updateProgress] = useProgressStorage();

  return (
    <SearchContext.Consumer>
      {({ form, filteredPokefutas }) => (
        <div className="flex flex-col flex-1 space-y-4">
          <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">
            ポケふたマップ
          </h2>

          {form}

          <GeolocationProvider>
            <MapCenterProvider>
              <GeolocationContext.Consumer>
                {(context) => (
                  <>
                    <MapPageChild
                      geolocationGen={geolocationGen}
                      filteredPokefutas={filteredPokefutas}
                    />
                    <Mantine.Divider />
                    <Mantine.Button
                      onClick={() => {
                        context.getGeolocation();
                        setGeolocationGen((gen) => gen + 1);
                      }}
                    >
                      GPSを利用して現在地を表示する
                    </Mantine.Button>

                    <div>
                      <p className="font-bold">地図の中心位置周辺のポケふた</p>
                      <MapCenterContext.Consumer>
                        {(context) =>
                          context.latitude &&
                          context.longitude && (
                            <PokefutasNearby
                              lat={context.latitude}
                              lng={context.longitude}
                              progress={progress}
                              filteredPokefutas={filteredPokefutas}
                            />
                          )
                        }
                      </MapCenterContext.Consumer>
                    </div>
                  </>
                )}
              </GeolocationContext.Consumer>
            </MapCenterProvider>
          </GeolocationProvider>
        </div>
      )}
    </SearchContext.Consumer>
  );
};

const MapPageChild: React.FC<{
  geolocationGen: number;
  filteredPokefutas?: ReturnType<typeof getFilteredPokefutas>;
}> = ({ geolocationGen, filteredPokefutas }) => {
  const mapRef = React.useRef<MapComponentHandle>(null);
  const geolocationContext = useGeolocationContext();

  React.useEffect(() => {
    if (geolocationContext.latitude && geolocationContext.longitude) {
      mapRef.current?.setCenter(
        geolocationContext.latitude,
        geolocationContext.longitude
      );
    }
  }, [
    geolocationGen,
    geolocationContext.latitude,
    geolocationContext.longitude,
  ]);

  return (
    <MapComponent
      ref={mapRef}
      style={{ minHeight: 320, flex: 1 }}
      ids={filteredPokefutas?.map((item) => item.id)}
    />
  );
};

export default MapPage;
