import React from "react";
import Image from "next/image";

import {
  getPokefutaData,
  getPokemonName,
  SPRITE_SHEET_PATH,
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
  size: number
): React.CSSProperties => {
  const { row, col } = getSpritePosition(id);
  return {
    backgroundImage: `url(${SPRITE_SHEET_PATH})`,
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
          ...getSpriteBackgroundProps(pokefuta.id, size),
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
