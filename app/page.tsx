"use client";

import * as Mantine from "@mantine/core";
import * as Lucide from "lucide-react";
import Link from "next/link";
import React from "react";

import { useProgressStorage } from "@/hooks";
import {
  getPokemonName,
  getPrefectureName,
  useFilteredPokefutas as filterPokefutas,
  type PokefutaData,
} from "@/util";
import PokefutaImage from "@/components/pokefuta-image";

const IndexPage: React.FC = () => {
  const groupByOptions = [
    { value: "pref", label: "Prefecture" },
    // { value: "generation", label: "Generation" },
  ] as const;
  type GroupByOption = (typeof groupByOptions)[number]["value"];

  const [hideVisited, setHideVisited] = React.useState(false);
  const [progress, _updateProgress] = useProgressStorage();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [groupBy, setGroupBy] = React.useState<GroupByOption>(
    groupByOptions[0].value
  );

  const filteredPokefutas = React.useMemo(() => {
    return filterPokefutas(searchTerm, progress, { hideVisited });
  }, [searchTerm, progress, hideVisited]);
  const groupedPokefutas = React.useMemo(() => {
    return filteredPokefutas.reduce((acc, pokefuta) => {
      const gruopKey = pokefuta.pref;
      acc[gruopKey] ??= [];
      acc[gruopKey].push(pokefuta);
      return acc;
    }, {} as Record<string, PokefutaData[]>);
  }, [filteredPokefutas]);
  const filteredProgression = Object.entries(progress).filter(
    ([id, visited]) => {
      return (
        visited &&
        filteredPokefutas.map((pokefuta) => pokefuta.id).includes(Number(id))
      );
    }
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">
          ポケふた一覧
        </h2>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <span>検索</span>
          <Mantine.TextInput
            type="text"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            leftSection={<Lucide.Search className="text-gray-400" />}
          />
          <span className="text-sm text-gray-500">
            例: 「ピカチュウ」「北海道」
          </span>
          {/*
        <Mantine.Select
          value={groupBy}
          onChange={(value) => setGroupBy(value as GroupByOption)}
          data={groupByOptions}
        />
        */}
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <Mantine.Checkbox
            id="hide-visited"
            onChange={(e) => setHideVisited(e.target.checked)}
          />
          <label htmlFor="hide-visited">訪問済みのポケふたを非表示にする</label>
        </div>
      </div>

      <div className="mt-8"></div>

      <p className="mt-2 text-gray-500">
        検索結果: {filteredProgression} / {filteredPokefutas.length}件
      </p>

      {Object.entries(groupedPokefutas).map(([group, items]) => {
        return (
          <div key={group} className="space-y-2">
            <h3 className="text-2xl text-red-700 font-bold">
              {getPrefectureName(group)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((pokefuta) => {
                const names = pokefuta.pokemons.map(getPokemonName).join(", ");
                const hasVisited = progress[pokefuta.id] ?? false;

                return (
                  <Link
                    key={pokefuta.id}
                    href={`/item/${pokefuta.id}`}
                    className={`flex space-x-2 p-4 rounded-lg shadow ${
                      hasVisited ? "bg-green-50" : ""
                    }`}
                  >
                    <PokefutaImage id={pokefuta.id} size={72} />
                    <div>
                      <p>{pokefuta.city}</p>
                      <p className="text-sm text-gray-600">{names}</p>
                    </div>
                    <Mantine.Box flex={1} />
                    <Lucide.ChevronRight className="self-center" />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IndexPage;
