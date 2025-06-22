import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";

import Link from "./link";
import PokefutaImage from "@/components/pokefuta-image";
import { getPokemonName, getTranslatedCityName, PokefutaData } from "@/util";

export const PokefutaCard: React.FC<{
  isEnglish: boolean;
  pokefuta: PokefutaData;
  progress: Record<number, boolean>;
  children?: React.ReactNode;
}> = ({ isEnglish, pokefuta, progress, children }) => {
  const names = pokefuta.pokemons
    .map((num) => getPokemonName(num, isEnglish))
    .join(", ");
  const hasVisited = progress[pokefuta.id] ?? false;

  return (
    <Link
      key={pokefuta.id}
      href={`/item/${pokefuta.id}`}
      className={`flex space-x-2 p-4 rounded-lg shadow ${
        hasVisited ? "bg-green-50" : ""
      }`}
      prefetch={false}
    >
      <PokefutaImage id={pokefuta.id} size={72} isSprite />
      <div>
        <p>
          {getTranslatedCityName(pokefuta.city, isEnglish)} {children}
        </p>
        <p className="text-sm text-gray-600">{names}</p>
      </div>
      <Mantine.Box flex={1} />
      <Lucide.ChevronRight className="self-center" />
    </Link>
  );
};
