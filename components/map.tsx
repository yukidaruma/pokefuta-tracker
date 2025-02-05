"use client";

import { useRouter } from "next/navigation";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { StadiaMaps, Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import React from "react";

import data from "@/data.json";
import { getPokefutaImage } from "@/util";
import { useMapCenterContext } from "@/providers/map-center";

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

    const updateMarkerLayer = (map: Map) => {
      const iconFeatures: Feature[] = [];

      // Show only pokefutas meeting the conditions
      const availablePokefutas = ids
        ? data.list.filter((pokefuta) => ids.includes(pokefuta.id))
        : data.list;
      const highlightedPokefuta = availablePokefutas.find(
        (pokefuta) => pokefuta.id === highlight
      );
      const pokefutas = highlightedPokefuta
        ? availablePokefutas.filter(
            (pokefuta) => pokefuta.pref === highlightedPokefuta.pref
          )
        : availablePokefutas;

      for (const pokefuta of pokefutas) {
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

      const oldLayer = map.getLayers().item(1);
      if (oldLayer) {
        // Replace layer if it already exists
        map.removeLayer(oldLayer);
        oldLayer.dispose();
      }
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: iconFeatures,
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
