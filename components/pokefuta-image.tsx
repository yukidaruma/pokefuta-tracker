import React from "react";
import Image from "next/image";

import images from "@/data/images";
import { SPRITE_SHEET_PATH, SPRITES_PER_ROW } from "@/utils/constants";
import { getPokefutaData, getPokemonName } from "@/utils/pokefuta";

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
      style={{
        borderRadius: "50%",
        borderColor: "transparent",
      }}
      alt={`Image of pokefuta with ${names}`}
      src={images[id]!}
      placeholder="blur"
      width={size}
      height={size}
      key={id}
    />
  );
};

export default PokefutaImage;
