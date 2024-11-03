"use client";

import { Input, Select } from "@mantine/core";
import * as lucide from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import data from "@/data.json";
import prefs from "@/prefs.json";
const { list, names } = data;

const getPokemonName = (num: string | number) => {
  return (names as Record<string, string>)[num];
};
const getPrefectureName = (code: string | number) => {
  return prefs.find((pref) => pref.code === Number(code))!.ja;
};

const IndexPage: React.FC = () => {
  const groupByOptions = [
    { value: "pref", label: "Prefecture" },
    // { value: "generation", label: "Generation" },
  ] as const;
  type GroupByOption = (typeof groupByOptions)[number]["value"];

  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState<GroupByOption>(
    groupByOptions[0].value
  );

  const normalizedSearchTerm = useMemo(() => {
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
  const filteredPokefutas = useMemo(() => {
    if (!normalizedSearchTerm) {
      return list;
    }

    return list.filter((pokefuta) => {
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
  }, [normalizedSearchTerm]);
  const groupedPokefutas = useMemo(() => {
    return filteredPokefutas.reduce((acc, pokefuta) => {
      const gruopKey = pokefuta.pref;
      acc[gruopKey] ??= [];
      acc[gruopKey].push(pokefuta);
      return acc;
    }, {} as Record<string, Array<(typeof list)[number]>>);
  }, [searchTerm, filteredPokefutas, groupBy]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10"
          />
          <lucide.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {/*
        <Select
          value={groupBy}
          onChange={(value) => setGroupBy(value as GroupByOption)}
          data={groupByOptions}
        />
        */}
      </div>

      {Object.entries(groupedPokefutas).map(([group, items]) => {
        return (
          <div key={group} className="space-y-2">
            <h2 className="text-xl font-bold">{getPrefectureName(group)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((pokefuta) => {
                const names = pokefuta.pokemons
                  .map((pokeNum) => getPokemonName(pokeNum))
                  .join(", ");

                return (
                  <Link
                    key={pokefuta.id}
                    href={`/item/${pokefuta.id}`}
                    className="flex space-x-2 bg-white p-4 rounded-lg shadow"
                  >
                    <Image
                      alt={`Image of pokefuta with ${names}`}
                      src={`/images/${pokefuta.id}.png`}
                      width={72}
                      height={72}
                    />
                    <div>
                      <p>{pokefuta.city}</p>
                      <p className="text-sm text-gray-600">{names}</p>
                    </div>
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
