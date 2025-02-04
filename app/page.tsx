"use client";

import * as Mantine from "@mantine/core";
import * as Lucide from "lucide-react";
import Link from "next/link";
import React from "react";

import data from "@/data.json";
import { useProgressStorage } from "@/hooks";
import { getPokemonName, getPrefectureName, type PokefutaData } from "@/util";
import PokefutaImage from "@/components/pokefuta-image";

const IndexPage: React.FC = () => {
  const groupByOptions = [
    { value: "pref", label: "Prefecture" },
    // { value: "generation", label: "Generation" },
  ] as const;
  type GroupByOption = (typeof groupByOptions)[number]["value"];

  const [hideVisited, setHideVisited] = React.useState(false);
  const [progress, updateProgress] = useProgressStorage();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [groupBy, setGroupBy] = React.useState<GroupByOption>(
    groupByOptions[0].value
  );

  const normalizedSearchTerm = React.useMemo(() => {
    return searchTerm
      .trim()
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        return code >= 0x3041 && code <= 0x3096
          ? String.fromCharCode(code + 0x60)
          : char;
      })
      .join("");
  }, [searchTerm]);
  const filteredPokefutas = React.useMemo(() => {
    return data.list.filter((pokefuta) => {
      // Hide visited
      if (hideVisited && progress[pokefuta.id]) {
        return false;
      }

      // If no search term is provided, do not apply filters
      if (!normalizedSearchTerm) {
        return data.list;
      }

      if (/^\d+$/.test(normalizedSearchTerm)) {
        // By pokedex number
        return pokefuta.pokemons.some((pokeNum) => {
          return pokeNum === normalizedSearchTerm;
        });
      }

      return (
        // By name
        pokefuta.pokemons.some((pokeNum) => {
          return getPokemonName(pokeNum).includes(normalizedSearchTerm);
        }) ||
        // By address
        pokefuta.address.includes(normalizedSearchTerm)
      );
    });
  }, [hideVisited, progress, normalizedSearchTerm]);
  const groupedPokefutas = React.useMemo(() => {
    return filteredPokefutas.reduce((acc, pokefuta) => {
      const gruopKey = pokefuta.pref;
      acc[gruopKey] ??= [];
      acc[gruopKey].push(pokefuta);
      return acc;
    }, {} as Record<string, PokefutaData[]>);
  }, [filteredPokefutas]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">
        ポケふた一覧
      </h2>

      <div className="mt-4">
        <div className="flex space-x-2">
          <Mantine.TextInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            leftSection={<Lucide.Search className="text-gray-400" />}
          />
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
