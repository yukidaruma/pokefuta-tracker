"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import Link from "next/link";
import React from "react";

import data from "@/data/data.json";
import { useProgressStorage } from "@/hooks";
import {
  getFilteredPokefutas,
  getPokemonName,
  getPrefectureName,
  type PokefutaData,
} from "@/util";
import PokefutaImage from "@/components/pokefuta-image";
import { SearchContext } from "@/providers/search";

const IndexPage: React.FC = () => {
  const [progress, _updateProgress] = useProgressStorage();

  const groupByOptions = [
    { value: "pref", label: "Prefecture" },
    // { value: "generation", label: "Generation" },
  ] as const;
  type GroupByOption = (typeof groupByOptions)[number]["value"];
  const [groupBy, setGroupBy] = React.useState<GroupByOption>(
    groupByOptions[0].value
  );

  return (
    <SearchContext.Consumer>
      {({ form, filteredPokefutas }) => {
        const groupedPokefutas = filteredPokefutas.reduce((acc, pokefuta) => {
          const gruopKey = pokefuta.pref;
          acc[gruopKey] ??= [];
          acc[gruopKey].push(pokefuta);
          return acc;
        }, {} as Record<string, PokefutaData[]>);

        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">
                ポケふた一覧
              </h2>
            </div>

            {form}

            {Object.entries(groupedPokefutas).map(([group, items]) => {
              return (
                <div key={group} className="space-y-2">
                  <h3 className="text-2xl text-red-700 font-bold">
                    {getPrefectureName(group)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((pokefuta) => {
                      const names = pokefuta.pokemons
                        .map(getPokemonName)
                        .join(", ");
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
      }}
    </SearchContext.Consumer>
  );
};

export default IndexPage;
