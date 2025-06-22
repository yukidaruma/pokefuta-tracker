"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";

import MapComponent, {
  MapComponentHandle,
  ZOOM_LEVEL_WHOLE_JAPAN,
} from "@/components/map";
import PokefutasNearby from "@/components/pokefutas-nearby";
import { useTranslation } from "@/i18n-client";
import {
  GeolocationContext,
  GeolocationProvider,
  useGeolocationContext,
} from "@/providers/geolocation";
import { MapCenterContext, MapCenterProvider } from "@/providers/map-center";
import { SearchContext } from "@/providers/search";
import { getFilteredPokefutas } from "@/util";

const MapPage = () => {
  const { t } = useTranslation();
  const [geolocationGen, setGeolocationGen] = React.useState(0);

  return (
    <SearchContext.Consumer>
      {({ form, filteredPokefutas }) => (
        <div className="flex flex-col flex-1 space-y-4">
          <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">
            {t("title_map")}
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
                      leftSection={<Lucide.MousePointer2 size={24} />}
                      onClick={() => {
                        context.getGeolocation();
                        setGeolocationGen((gen) => gen + 1);
                      }}
                    >
                      {t("map_use_gps")}
                    </Mantine.Button>

                    <div>
                      <p className="font-bold">{t("map_nearby_pokefutas")}</p>
                      <MapCenterContext.Consumer>
                        {(context) =>
                          context.latitude &&
                          context.longitude && (
                            <PokefutasNearby
                              lat={context.latitude}
                              lng={context.longitude}
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
      style={{ height: 600 }}
      zoom={ZOOM_LEVEL_WHOLE_JAPAN}
      ids={filteredPokefutas?.map((item) => item.id)}
      hasCrosshair
    />
  );
};

export default MapPage;
