import * as Lucide from "lucide-react";
import React from "react";
import * as Mantine from "@mantine/core";

import Link from "@/components/link";
import PokefutaImage from "@/components/pokefuta-image";
import { useTranslation } from "@/i18n/client";
import {
  getPokemonName,
  getTranslatedCityName,
  PokefutaData,
} from "@/utils/pokefuta";

export const PokefutaCard: React.FC<{
  isEnglish: boolean;
  pokefuta: PokefutaData;
  progress: Record<number, boolean>;
  updateProgress?: (id: number, visited: boolean) => void;
  navigate?: (id: number) => void;
  children?: React.ReactNode;
}> = ({
  isEnglish,
  pokefuta,
  progress,
  updateProgress,
  navigate,
  children,
}) => {
  const { i18n } = useTranslation();

  const names = pokefuta.pokemons
    .map((num) => getPokemonName(num, isEnglish))
    .join(", ");
  const hasVisited = progress[pokefuta.id] ?? false;

  const handleClick = (e: React.MouseEvent) => {
    if (navigate) {
      e.preventDefault();
      navigate(pokefuta.id);
    }
  };

  const CardContent = (
    <>
      <PokefutaImage id={pokefuta.id} size={72} isSprite />
      <div>
        <p>
          {getTranslatedCityName(pokefuta.city, isEnglish)} {children}
        </p>
        <p className="text-sm text-gray-600">{names}</p>
      </div>
      <Mantine.Box flex={1} />
      <Lucide.ChevronRight className="self-center" />
    </>
  );

  const commonProps = {
    className: `flex space-x-2 p-4 rounded-lg shadow select-none cursor-pointer ${
      hasVisited ? "bg-blue-50" : ""
    }`,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    style: { WebkitTouchCallout: "none" as const },
  };

  if (navigate) {
    return (
      <a
        href={`/${i18n.language}/item/${pokefuta.id}`}
        onClick={handleClick}
        {...commonProps}
      >
        {CardContent}
      </a>
    );
  }

  return (
    <Link href={`/item/${pokefuta.id}`} prefetch={false} {...commonProps}>
      {CardContent}
    </Link>
  );
};
