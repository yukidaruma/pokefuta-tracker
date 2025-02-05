"use client";

import { useRouter } from "next/navigation";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { StadiaMaps, Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import React from "react";

import data from "@/data.json";
import { getPokefutaImage } from "@/util";

export type MapComponentProps = {
  highlight?: number;
  initialLat?: string | number;
  initialLng?: string | number;
};

const MapComponent: React.FC<MapComponentProps> = ({
  highlight,
  initialLng,
  initialLat,
}) => {
  const [map, setMap] = React.useState<Map | null>(null);
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new StadiaMaps({
              layer: "osm_bright",
              retina: true,
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([Number(initialLng), Number(initialLat)]),
          zoom: 14,
        }),
      });

      const iconFeatures: Feature[] = [];

      // Show only pokefutas from same prefecture as the highlighted one
      const highlightedPokefuta = data.list.find(
        (pokefuta) => pokefuta.id === highlight
      )!;
      const pokefutasInSamePref = data.list.filter(
        (pokefuta) => pokefuta.pref === highlightedPokefuta.pref
      );
      for (const pokefuta of pokefutasInSamePref) {
        const iconFeature = new Feature({
          geometry: new Point(
            fromLonLat([Number(pokefuta.coords[1]), Number(pokefuta.coords[0])])
          ),
        });
        const iconStyle = new Style({
          image: new Icon({
            src: getPokefutaImage(pokefuta.id),
            opacity: highlight && highlight !== pokefuta.id ? 0.5 : 1,
            height: 48,
            width: 48,
          }),
        });

        iconFeature.setId(pokefuta.id);
        iconFeature.setStyle(iconStyle);

        iconFeatures.push(iconFeature);
      }

      const vectorSource = new VectorSource({
        features: iconFeatures,
      });
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      // Change cursor to pointer on hovering over a feature (non-highlighted ones only)
      newMap.on("pointermove", function (e) {
        const hoveredFeature = newMap.getFeaturesAtPixel(e.pixel)[0];
        const isClickable =
          hoveredFeature &&
          (!highlight || hoveredFeature.getId() !== highlight);
        newMap.getViewport().style.cursor = isClickable ? "pointer" : "";
      });

      newMap.on("click", function (e) {
        const clickedFeature = newMap.getFeaturesAtPixel(e.pixel)[0];
        const isClickable =
          clickedFeature &&
          (!highlight || clickedFeature.getId() !== highlight);

        if (isClickable) {
          router.push(`/item/${clickedFeature.getId()}`);
        }
      });

      newMap.addLayer(vectorLayer);
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, [initialLat, initialLng, map]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
