import React from "react";
import Image from "next/image";

import { getPokefutaData, getPokemonName } from "@/util";
type PokefutaImageProps = {
  id: number;
  size: number;
};

const PokefutaImage: React.FC<PokefutaImageProps> = ({ id, size }) => {
  const pokefuta = getPokefutaData(id)!;
  const names = pokefuta.pokemons.map(getPokemonName).join(", ");

  return (
    <Image
      alt={`Image of pokefuta with ${names}`}
      src={`/images/pokefuta/${pokefuta.id}.png`}
      width={size}
      height={size}
    />
  );
};

export default PokefutaImage;
