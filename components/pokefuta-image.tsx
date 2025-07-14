import React from "react";
import Image from "next/image";

import { useSpriteFormatStorage } from "@/hooks";
import {
  getPokefutaData,
  getPokemonName,
  getSpriteSheetPath,
  SPRITES_PER_ROW,
} from "@/util";

type PokefutaImageProps = {
  id: number;
  size: number;
  isSprite?: boolean;
};

const getSpritePosition = (id: number) => {
  const index = id - 1;
  const row = Math.floor(index / SPRITES_PER_ROW);
  const col = index % SPRITES_PER_ROW;
  return { row, col };
};

const getSpriteBackgroundProps = (
  id: number,
  size: number,
  enableWebP: boolean
): React.CSSProperties => {
  const { row, col } = getSpritePosition(id);
  return {
    backgroundImage: `url(${getSpriteSheetPath(enableWebP)})`,
    backgroundPosition: `-${col * size}px -${row * size}px`,
    backgroundSize: `${SPRITES_PER_ROW * size}px auto`,
  };
};

const PokefutaImage: React.FC<PokefutaImageProps> = ({
  id,
  size,
  isSprite,
}) => {
  const pokefuta = getPokefutaData(id)!;
  const [enableWebP] = useSpriteFormatStorage();
  const names = pokefuta.pokemons
    .map((num) => getPokemonName(num, true))
    .join(", ");

  if (isSprite) {
    return (
      <div
        className="relative"
        role="img"
        aria-label={`Image of pokefuta with ${names}`}
        style={{
          flexShrink: 0,
          width: size,
          height: size,
          ...getSpriteBackgroundProps(pokefuta.id, size, enableWebP),
        }}
      />
    );
  }

  return (
    <Image
      priority={false}
      alt={`Image of pokefuta with ${names}`}
      src={`/images/pokefuta/${pokefuta.id}.png`}
      width={size}
      height={size}
    />
  );
};

export default PokefutaImage;
