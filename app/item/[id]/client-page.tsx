"use client";

import { useParams } from "next/navigation";

import * as Mantine from "@mantine/core";
import * as Lucide from "lucide-react";

import data from "@/data.json";
import { useProgressStorage } from "@/hooks";
import {
  calcDistance,
  getPokefutaData,
  getPokefutaImage,
  getPokemonName,
  getPrefectureName,
} from "@/util";
import MapComponent from "@/components/map";
import PokefutaImage from "@/components/pokefuta-image";
import ExternalLink from "@/components/external-link";
import Copyable from "@/components/copyable";
import Link from "next/link";

const ItemClientPage: React.FC = () => {
  const params = useParams();
  const id = Number(params.id as string);
  const pokefutaData = getPokefutaData(id)!;

  const [progress, updateProgress] = useProgressStorage();
  const hasVisited = progress[id];
  const toggleVisited = () => {
    updateProgress(id, !hasVisited);
  };

  const [lat, long] = pokefutaData.coords;

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold whitespace-pre-line md:whitespace-normal">
        {getPrefectureName(pokefutaData.pref)}
        {pokefutaData.city}
        {"\n"}
        {pokefutaData.pokemons.map(getPokemonName).join("・")}のポケふた
      </h2>

      <div className="flex flex-col md:flex-row">
        <div className="flex self-start justify-center flex-1 mx-auto">
          <div className="sm:hidden">
            <PokefutaImage id={id} size={200} />
          </div>
          <div className="hidden sm:block md:hidden">
            <PokefutaImage id={id} size={280} />
          </div>
          <div className="hidden md:block">
            <PokefutaImage id={id} size={360} />
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex-1">
          <MapComponent pinIcon={getPokefutaImage(id)} lat={lat} lng={long} />
          <div className="mt-4 flex flex-col space-y-4">
            <Copyable
              value={pokefutaData.address}
              copyMessage="住所をコピーしました"
            >
              <div className="flex items-center space-x-1">
                <Lucide.MapPin color="gray" />
                <span>{pokefutaData.address}</span>
              </div>
            </Copyable>

            <Copyable
              value={`${lat}, ${long}`}
              copyMessage="座標をコピーしました"
            >
              <div className="flex items-center space-x-1">
                <Lucide.Globe color="gray" />
                <span>
                  {lat}, {long}
                </span>
              </div>
            </Copyable>

            <div className="flex items-center space-x-1">
              <Lucide.ExternalLink color="gray" />
              <ExternalLink
                href={`https://local.pokemon.jp/manhole/desc/${id}/`}
              >
                ポケふた公式ページ
              </ExternalLink>
            </div>

            <div className="flex items-center space-x-1">
              <Lucide.ExternalLink color="gray" />
              <ExternalLink
                href={`https://www.google.co.jp/maps/?q=${lat}+${long}`}
              >
                Google Maps
              </ExternalLink>
            </div>

            {hasVisited ? (
              <Mantine.Button color="red" onClick={toggleVisited}>
                <Lucide.X />
                <span>訪問済みを解除する</span>
              </Mantine.Button>
            ) : (
              <Mantine.Button onClick={toggleVisited}>
                <Lucide.Check />
                <span>訪問済みにする</span>
              </Mantine.Button>
            )}

            <Mantine.Divider className="my-6" />

            <h4 className="font-bold">周辺のポケふた</h4>
            <PokefutasNearby progress={progress} lat={lat} long={long} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PokefutasNearby: React.FC<{
  progress: ReturnType<typeof useProgressStorage>[0];
  lat: string;
  long: string;
}> = ({ progress, lat, long }) => {
  // Get 5 nearby pokefutas
  const nearby = data.list
    .filter(
      (pokefuta) => pokefuta.coords[0] !== lat && pokefuta.coords[1] !== long
    )
    .map((pokefuta) => {
      const distance = calcDistance(
        Number(lat),
        Number(long),
        Number(pokefuta.coords[0]),
        Number(pokefuta.coords[1])
      );
      return { ...pokefuta, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {nearby.map((pokefuta) => {
        const hasVisited = progress[pokefuta.id];

        return (
          <Link
            key={pokefuta.id}
            href={`/item/${pokefuta.id}`}
            className={`flex items-center p-2 space-x-2 rounded-lg shadow ${
              hasVisited ? "bg-green-50" : ""
            }`}
          >
            <PokefutaImage id={pokefuta.id} size={80} />
            <div className="flex flex-col">
              <span>
                {getPrefectureName(pokefuta.pref)} {pokefuta.city}
              </span>
              <span className="text-sm text-gray-600">
                {pokefuta.distance.toFixed(1)} km
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ItemClientPage;
