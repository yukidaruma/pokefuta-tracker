"use client";

import { useParams } from "next/navigation";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";

import MapComponent from "@/components/map";
import PokefutaImage from "@/components/pokefuta-image";
import ExternalLink from "@/components/external-link";
import Copyable from "@/components/copyable";
import PokefutasNearby from "@/components/pokefutas-nearby";
import { useProgressStorage } from "@/hooks";
import { getPokefutaData, getPokemonName, getPrefectureName } from "@/util";

const ItemClientPage: React.FC = () => {
  const params = useParams();
  const id = Number(params.id as string);
  const pokefutaData = getPokefutaData(id)!;

  const [progress, updateProgress] = useProgressStorage();
  const hasVisited = progress[id];
  const toggleVisited = () => {
    updateProgress(id, !hasVisited);
  };

  const [lat, lng] = pokefutaData.coords;

  return (
    <div className="flex flex-col flex-1 space-y-4">
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
          <MapComponent
            style={{ height: 400 }}
            highlight={id}
            initialLat={lat}
            initialLng={lng}
          />
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
              value={`${lat}, ${lng}`}
              copyMessage="座標をコピーしました"
            >
              <div className="flex items-center space-x-1">
                <Lucide.Globe color="gray" />
                <span>
                  {lat}, {lng}
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
                href={`https://www.google.co.jp/maps/?q=${lat}+${lng}`}
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

            <h4 className="font-bold">このポケふたの周辺のポケふた</h4>
            <PokefutasNearby progress={progress} pokefutaData={pokefutaData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemClientPage;
