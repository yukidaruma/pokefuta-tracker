import data from "@/data/data.json";
import evolutions from "@/data/evolutions.json";
import prefs from "@/data/prefs.json";
import cityTranslation from "@/data/municipality-translation.json";
import {
  getPokemonName,
  normalizeKana,
  normalizePokemonNumber,
  type PokefutaData,
} from "@/utils/pokefuta";

type FilterField = "visited" | "wishlisted";
type FilterOperator = "true" | "false";
export type FilterTuple = readonly [FilterField, FilterOperator];

type FilterOptions = {
  language: string;
  progress?: Record<number, boolean>;
  wishlist?: Record<number, boolean>;
  includeEvolutions?: boolean;
};

export const getFilteredPokefutas = (
  searchTerm: string,
  filters: FilterTuple[],
  options: FilterOptions
) => {
  let results = data.list.concat();

  if (filters.length > 0) {
    results = applyConditionalFilters(results, filters, options);
  }

  results = applySearchTermFilter(results, searchTerm, options);

  return results;
};

const applyConditionalFilters = (
  pokefutas: PokefutaData[],
  filters: FilterTuple[],
  options: {
    progress?: Record<number, boolean>;
    wishlist?: Record<number, boolean>;
  }
) => {
  const fieldComparators: Record<FilterField, (id: number) => boolean> = {
    visited(id: number) {
      return !!options.progress?.[id];
    },
    wishlisted(id: number) {
      return !!options.wishlist?.[id];
    },
  };

  return pokefutas.filter((pokefuta) => {
    for (const [field, operator] of filters) {
      const value = fieldComparators[field](pokefuta.id);
      switch (operator) {
        case "true":
          if (!value) return false;
          break;
        case "false":
          if (value) return false;
          break;
      }
    }
    return true;
  });
};

const applySearchTermFilter = (
  pokefutas: PokefutaData[],
  searchTerm: string,
  options: {
    language: string;
    includeEvolutions?: boolean;
  }
) => {
  const isEnglish = options.language === "en";
  const normalizedSearchTerm = normalizeKana(searchTerm).toLowerCase();
  const isSearchByPokedexNumber = /^\d+$/.test(normalizedSearchTerm);

  // If no search term is provided, do not apply filters
  if (!normalizedSearchTerm) {
    return pokefutas;
  }

  return pokefutas.filter((pokefuta) => {
    // Search by Pokedex number
    // Since there are no pokemon with number-only name, we can skip searching by text
    if (isSearchByPokedexNumber) {
      return matchesPokedexNumber(
        pokefuta,
        normalizedSearchTerm,
        options.includeEvolutions
      );
    }

    // Search by text (address, pokemon name)
    return matchesQuery(
      pokefuta,
      normalizedSearchTerm,
      options.includeEvolutions,
      isEnglish
    );
  });
};

const matchesPokedexNumber = (
  pokefuta: PokefutaData,
  pokedexNumber: string,
  includeEvolutions = false
) => {
  if (!includeEvolutions) {
    // Some pokemon have multiple forms, so we need to check only the base form
    return pokefuta.pokemons.some(
      (pokeNum) => pokeNum.split("-")[0] === pokedexNumber
    );
  }

  const targetEvolutionChain = findEvolutionChain(Number(pokedexNumber));
  if (targetEvolutionChain.length === 0) {
    return pokefuta.pokemons.some(
      (pokeNum) => pokeNum.split("-")[0] === pokedexNumber
    );
  }

  return pokefuta.pokemons.some((pokeNum) => {
    const baseNumber = normalizePokemonNumber(pokeNum);
    return targetEvolutionChain.includes(baseNumber);
  });
};

const matchesQuery = (
  pokefuta: PokefutaData,
  searchText: string,
  includeEvolutions: boolean = false,
  isEnglish: boolean
): boolean => {
  // Search in address
  if (pokefuta.address.includes(searchText)) {
    return true;
  }

  // Search in English address
  if (isEnglish) {
    const translatedCity = (cityTranslation as Record<string, string>)[
      pokefuta.city
    ];
    const prefecture = prefs.find((pref) => pref.code === pokefuta.pref);

    if (
      translatedCity?.toLowerCase().includes(searchText) ||
      prefecture?.name.toLowerCase().includes(searchText)
    ) {
      return true;
    }
  }

  if (!includeEvolutions) {
    return pokefuta.pokemons.some((pokeNum) => {
      const pokemonName = getPokemonName(pokeNum, isEnglish);
      return pokemonName?.toLowerCase().includes(searchText);
    });
  }

  const matchingEvolutionChains = findMatchingEvolutionChains(
    searchText,
    isEnglish
  );

  return pokefuta.pokemons.some((pokeNum) => {
    const baseNumber = normalizePokemonNumber(pokeNum);
    return matchingEvolutionChains.some((chain) => chain.includes(baseNumber));
  });
};

export const findEvolutionChain = (pokemonNumber: number): number[] => {
  for (const evolutionChain of evolutions) {
    if (evolutionChain.includes(pokemonNumber)) {
      // Since no pokemon appears in multiple evolution chains, we can stop searching
      // as soon as we find a matching chain
      return evolutionChain;
    }
  }

  return [];
};

const findMatchingEvolutionChains = (
  searchText: string,
  isEnglish: boolean
): number[][] => {
  const matchingChains: number[][] = [];

  for (const evolutionChain of evolutions) {
    const chainMatches = evolutionChain.some((pokeNum) => {
      const pokemonName = getPokemonName(pokeNum, isEnglish);
      return pokemonName?.toLowerCase().includes(searchText);
    });

    if (chainMatches) {
      matchingChains.push(evolutionChain);
    }
  }

  return matchingChains;
};
