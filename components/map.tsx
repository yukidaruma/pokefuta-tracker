"use client";

import React from "react";
import { useRouter } from "next/navigation";

import "ol/ol.css";
import { Feature, Map, View } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { OSM, Vector as VectorSource } from "ol/source";
import TileLayer from "ol/layer/Tile";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import type { FlatStyleLike } from "ol/style/flat";

import { SPRITE_SHEET_PATH, SPRITE_SIZE, SPRITES_PER_ROW } from "@/constants";
import data from "@/data/data.json";
import { useMapCenterContext } from "@/providers/map-center";

export const ZOOM_LEVEL_WHOLE_JAPAN = 4.8;
const ZOOM_LEVEL_ZOOMED_IN = 14;

export type MapComponentProps = {
  style?: React.CSSProperties;
  zoom?: number;
  initialLat?: string | number;
  initialLng?: string | number;
  hasCrosshair?: boolean;

  // Ids to show on the map
  ids?: number[];

  // Id to highlight
  // If `highlight` is set, only pokefutas from the same prefecture will be shown
  // If both `ids` and `highlight` are not set, all pokefutas will be shown
  highlight?: number;

  navigate?: (id: number) => void;
};

export type MapComponentHandle = {
  setCenter(lat: number, lng: number): void;
};

const MapComponent = React.forwardRef<MapComponentHandle, MapComponentProps>(
  (
    {
      style,
      zoom = ZOOM_LEVEL_ZOOMED_IN,

      // Fall back to Pokefuta in Ueno Park (172)
      initialLng = 139.775397,
      initialLat = 35.717715,

      hasCrosshair,
      ids,
      highlight,
      navigate,
    },
    ref
  ) => {
    React.useImperativeHandle(ref, () => ({
      setCenter(lat: number, lng: number) {
        map?.getView().setCenter(fromLonLat([lng, lat]));
        map?.getView().setZoom(ZOOM_LEVEL_ZOOMED_IN);
      },
    }));

    const [map, setMap] = React.useState<Map | null>(null);
    const mapRef = React.useRef<HTMLDivElement | null>(null);
    const mapCenterContext = useMapCenterContext();
    const router = useRouter();
    const currentHighlight = React.useRef(highlight);

    const pokefutaFeatures: Feature[] = [];
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

      pokefutaFeatures.push(iconFeature);
    }

    const buildWebGLStyle = (highlight?: number): FlatStyleLike => {
      const maxPokefutaId = data.list.reduce(
        (max, pokefuta) => Math.max(max, pokefuta.id),
        0
      );
      const pokefutaRows = Math.ceil(maxPokefutaId / SPRITES_PER_ROW);

      const style: FlatStyleLike = {
        "icon-src": SPRITE_SHEET_PATH,
        "icon-size": [SPRITE_SIZE, SPRITE_SIZE],
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
            1 + SPRITES_PER_ROW * i,
            [0, i * SPRITE_SIZE],

            // Offset of end of the row
            SPRITES_PER_ROW * (i + 1),
            [(SPRITES_PER_ROW - 1) * SPRITE_SIZE, SPRITE_SIZE * i],
          ]).flat(),
        ],
      };

      if (highlight) {
        style["icon-opacity"] = ["match", ["get", "id"], highlight, 1, 0.5];
      }

      return style;
    };

    const centerOnHighlight = (mapInstance: Map, highlightId: number) => {
      const highlightedPokefuta = data.list.find((p) => p.id === highlightId)!;
      const [lat, lng] = highlightedPokefuta.coords;
      mapInstance.getView().setCenter(fromLonLat([Number(lng), Number(lat)]));
      mapInstance.getView().setZoom(ZOOM_LEVEL_ZOOMED_IN);
    };

    const updatePokefutaLayer = (map: Map) => {
      const oldLayer = map.getLayers().item(1);
      if (oldLayer) {
        map.removeLayer(oldLayer);
      }

      // Show only pokefutas meeting the conditions
      const visiblePokefutas = ids
        ? data.list.filter((pokefuta) => ids.includes(pokefuta.id))
        : data.list;

      const filteredFeatures = pokefutaFeatures.filter((feature) => {
        return visiblePokefutas.some(
          (pokefuta) => pokefuta.id === feature.getId()
        );
      });

      const vectorLayer = new WebGLVectorLayer({
        style: buildWebGLStyle(highlight),
        source: new VectorSource({
          features: filteredFeatures,
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
            zoom,
            enableRotation: false,
            maxZoom: 18,
          }),
        });

        // Change cursor to pointer on hovering over a feature (non-highlighted ones only)
        newMap.on("pointermove", function (e) {
          const hoveredFeature = newMap.getFeaturesAtPixel(e.pixel)[0];
          const isClickable =
            hoveredFeature &&
            (!currentHighlight.current ||
              hoveredFeature.getId() !== currentHighlight.current);
          newMap.getViewport().style.cursor = isClickable ? "pointer" : "";
        });

        newMap.on("click", function (e) {
          const clickedFeature = newMap.getFeaturesAtPixel(e.pixel)[0];
          const isClickable =
            clickedFeature &&
            (!currentHighlight.current ||
              clickedFeature.getId() !== currentHighlight.current);

          if (isClickable) {
            if (navigate) {
              navigate(clickedFeature.getId() as number);
            } else {
              router.push(`/item/${clickedFeature.getId()}`);
            }
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

        updatePokefutaLayer(newMap);

        // Auto-center on initial render
        if (highlight) {
          centerOnHighlight(newMap, highlight);
        }

        setMap(newMap);
      }

      return () => {
        if (map) {
          // Dispose of all layers before cleanup
          map.getLayers().forEach((layer) => {
            if (layer.dispose) {
              layer.dispose();
            }
          });
          map.setTarget(undefined);
        }
      };
    }, [map]);

    React.useEffect(() => {
      if (!map) {
        return;
      }

      currentHighlight.current = highlight;

      updatePokefutaLayer(map);

      // Auto-center on highlighted pokefuta change
      if (highlight) {
        centerOnHighlight(map, highlight);
      }
    }, [ids, highlight]);

    return (
      <div
        ref={(node) => {
          mapRef.current = node;
        }}
        style={{ ...style, position: "relative", width: "100%" }}
      >
        {hasCrosshair && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              pointerEvents: "none",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2V22M2 12H22" stroke="#0006" strokeWidth={2} />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

MapComponent.displayName = "MapComponent";

export default MapComponent;
