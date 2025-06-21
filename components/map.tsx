"use client";

import { useRouter } from "next/navigation";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { OSM, Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import React from "react";

import data from "@/data/data.json";
import { useMapCenterContext } from "@/providers/map-center";
import WebGLVectorLayer from "ol/layer/WebGLVector";

export type MapComponentProps = {
  style?: React.CSSProperties;
  initialLat?: string | number;
  initialLng?: string | number;

  // Ids to show on the map
  ids?: number[];

  // Id to highlight
  // If `highlight` is set, only pokefutas from the same prefecture will be shown
  // If both `ids` and `highlight` are not set, all pokefutas will be shown
  highlight?: number;
};

export type MapComponentHandle = {
  setCenter(lat: number, lng: number): void;
};

const MapComponent = React.forwardRef<MapComponentHandle, MapComponentProps>(
  (
    {
      style,

      // Fall back to Pokefuta in Ueno Park (172)
      initialLng = 139.775397,
      initialLat = 35.717715,

      ids,
      highlight,
    },
    ref
  ) => {
    React.useImperativeHandle(ref, () => ({
      setCenter(lat: number, lng: number) {
        map?.getView().setCenter(fromLonLat([lng, lat]));
      },
    }));

    const [map, setMap] = React.useState<Map | null>(null);
    const mapRef = React.useRef<HTMLDivElement | null>(null);
    const mapCenterContext = useMapCenterContext();
    const router = useRouter();

    const iconFeatures: Feature[] = [];
    for (const pokefuta of data.list) {
      const iconFeature = new Feature({
        geometry: new Point(
          fromLonLat([Number(pokefuta.coords[1]), Number(pokefuta.coords[0])])
        ),
      });

      iconFeature.setId(pokefuta.id);
      iconFeature.setProperties({
        id: pokefuta.id,
      });

      iconFeatures.push(iconFeature);
    }

    const updateMarkerLayer = (map: Map) => {
      const oldLayer = map.getLayers().item(1);
      if (oldLayer) {
        // Replace layer if it already exists
        map.removeLayer(oldLayer);
      }

      // Show only pokefutas meeting the conditions
      const availablePokefutas = ids
        ? data.list.filter((pokefuta) => ids.includes(pokefuta.id))
        : data.list;
      const highlightedPokefuta = availablePokefutas.find(
        (pokefuta) => pokefuta.id === highlight
      );

      const maxPokefutaId = availablePokefutas.reduce(
        (max, pokefuta) => Math.max(max, pokefuta.id),
        0
      );

      const iconsPerRow = 4032 / 96;
      const pokefutaRows = Math.ceil(maxPokefutaId / iconsPerRow);
      const style = {
        "icon-src": "/images/pokefuta/sprite.png",
        "icon-size": [96, 96],
        "icon-scale": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6,
          0.25,
          10,
          0.5,
          14,
          0.75,
          18,
          1,
        ],
        "icon-offset": [
          "interpolate",
          ["linear"],
          ["get", "id"],

          ...Array.from({ length: pokefutaRows }, (_, i) => [
            // Offset of start of the row
            1 + iconsPerRow * i,
            [0, i * 96],

            // Offset of end of the row
            iconsPerRow * (i + 1),
            [4032 - 96, 96 * i],
          ]).flat(),
        ],
      } as Record<string, any>;
      if (highlight) {
        style["icon-opacity"] = ["match", ["get", "id"], highlight, 1, 0.5];
      }

      const vectorLayer = new WebGLVectorLayer({
        style,
        source: new VectorSource({
          features: iconFeatures.filter((feature) => {
            return availablePokefutas.some(
              (pokefuta) => pokefuta.id === feature.getId()
            );
          }),
        }),
      });
      map.addLayer(vectorLayer);
    };

    React.useEffect(() => {
      if (mapRef.current && !map) {
        const newMap = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: fromLonLat([Number(initialLng), Number(initialLat)]),
            zoom: 14,
            enableRotation: false,
            maxZoom: 18,
          }),
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

        newMap.on("moveend", function (e) {
          const centerCoordinates = newMap.getView().getCenter();
          if (!centerCoordinates) {
            return;
          }

          const centerLatLong = toLonLat(centerCoordinates);
          mapCenterContext.setCoordinates(centerLatLong[1], centerLatLong[0]);
        });

        updateMarkerLayer(newMap);
        setMap(newMap);
      }

      return () => {
        if (map) {
          map.setTarget(undefined);
        }
      };
    }, [map]);

    React.useEffect(() => {
      if (!map) {
        return;
      }

      updateMarkerLayer(map);
    }, [ids, highlight]);

    return (
      <div
        ref={(node) => {
          mapRef.current = node;
        }}
        style={{ ...style, width: "100%" }}
      />
    );
  }
);

MapComponent.displayName = "MapComponent";

export default MapComponent;
