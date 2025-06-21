import React from "react";
import Image from "next/image";

import { getPokefutaData, getPokemonName } from "@/util";
type PokefutaImageProps = {
  id: number;
  size: number;
  isSprite?: boolean;
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
    const SPRITES_PER_ROW = 42;
    const index = pokefuta.id - 1; // assuming id starts from 1
    const row = Math.floor(index / SPRITES_PER_ROW);
    const col = index % SPRITES_PER_ROW;

    return (
      <div
        className="relative"
        role="img"
        aria-label={`Image of pokefuta with ${names}`}
        style={{
          flexShrink: 0,
          width: size,
          height: size,
          backgroundImage: "url(/images/pokefuta/sprite.png)",
          backgroundPosition: `-${col * size}px -${row * size}px`,
          backgroundSize: `${SPRITES_PER_ROW * size}px auto`,
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
