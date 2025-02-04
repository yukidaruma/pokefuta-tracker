"use client";

import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { StadiaMaps, Vector as VectorSource } from "ol/source";
import { Icon, IconImage, Style } from "ol/style";
import React from "react";
import ImageStyle from "ol/style/Image";

export type MapComponentProps = {
  pinIcon: string;
  lat: string | number;
  lng: string | number;
};

const MapComponent: React.FC<MapComponentProps> = ({ pinIcon, lat, lng }) => {
  const [map, setMap] = React.useState<Map | null>(null);
  const mapRef = React.useRef<HTMLDivElement | null>(null);

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
          center: fromLonLat([Number(lng), Number(lat)]),
          zoom: 16,
        }),
      });

      const iconFeature = new Feature({
        geometry: new Point(fromLonLat([Number(lng), Number(lat)])),
      });
      const iconStyle = new Style({
        image: new Icon({
          height: 48,
          width: 48,
          src: pinIcon,
        }),
      });
      iconFeature.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: [iconFeature],
      });
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      newMap.addLayer(vectorLayer);
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, [lat, lng, map]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
