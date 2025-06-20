import data from "@/data/data.json";
import evolutions from "@/data/evolutions.json";
import prefs from "@/data/prefs.json";
import cityTranslation from "@/data/municipality-translation.json";

export type PokefutaData = (typeof data.list)[number];

export const getPokefutaData = (id: number) => {
  return data.list.find((item) => item.id === id) ?? null;
};
export const getPokefutaImage = (id: number) => {
  return `/images/pokefuta/${id}.png`;
};
export const getPokemonName = (
  num: string | number,
  isEnglish: boolean = false
): string | undefined => {
  const langKey = isEnglish ? "namesEn" : ("names" satisfies keyof typeof data);
  return (data[langKey] as Record<string, string>)[num];
};
export const getPokemonNamesCombined = (
  num: Array<string | number>,
  isEnglish: boolean = false
) => {
  const separator = isEnglish ? ", " : "・";
  return num.map((num) => getPokemonName(num, isEnglish)).join(separator);
};
export const getPrefectureByCode = (code: string | number) => {
  return prefs.find((pref) => pref.code === Number(code));
};
export const getTranslatedCityName = (
  cityName: string,
  isEnglish: boolean = false
) => {
  return isEnglish
    ? (cityTranslation as Record<string, string>)[cityName]
    : cityName;
};

// Remove duplicates from an array
export const unique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

// Calculate distance between two points in latitude and longitude
export const calcDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6378.137; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

// Converts numeric degrees to radians
const toRad = (Value: number) => {
  return (Value * Math.PI) / 180;
};

// Normalize search term by converting hiragana to katakana
export const normalizeKana = (searchTerm: string) => {
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
};

// Filter pokefutas by search term
export const getFilteredPokefutas = (
  searchTerm: string,
  options: {
    language: string;
    progress?: Record<number, boolean>;
    hideVisited?: boolean;
    includeEvolutions?: boolean;
  }
) => {
  const isEnglish = options.language === "en";
  const normalizedSearchTerm = normalizeKana(searchTerm).toLowerCase();
  const isSearchByPokedexNumber = /^\d+$/.test(normalizedSearchTerm);

  const matchedEvoPokeNums = new Set<number>();
  if (options.includeEvolutions) {
    // Since no pokemon appears in multiple evolution chains, we can stop searching early
    outer: for (const evolutionChain of evolutions) {
      for (const pokeNum of evolutionChain) {
        if (isSearchByPokedexNumber) {
          if (pokeNum.toString() === normalizedSearchTerm) {
            evolutionChain.forEach((it) => matchedEvoPokeNums.add(it));
            break outer;
          }
        } else if (
          getPokemonName(pokeNum, isEnglish)
            ?.toLowerCase()
            .includes(normalizedSearchTerm)
        ) {
          evolutionChain.forEach((it) => matchedEvoPokeNums.add(it));
          break outer;
        }
      }
    }
  }

  return data.list.filter((pokefuta) => {
    // Hide visited
    if (options.hideVisited && options.progress?.[pokefuta.id]) {
      return false;
    }

    // If no search term is provided, do not apply filters
    if (!normalizedSearchTerm) {
      return true;
    }

    // By Pokedex number (skipping address search)
    // If includeEvolutions is true, skip both name and address search, so we use matchedEvoPokeNums later
    if (isSearchByPokedexNumber) {
      if (!options.includeEvolutions) {
        return pokefuta.pokemons.some((pokeNum) => {
          // Some pokemon have multiple forms, so we need to check only the base form
          return pokeNum.split("-")[0] === normalizedSearchTerm;
        });
      }
    } else {
      // By address
      if (pokefuta.address.includes(normalizedSearchTerm)) {
        return true;
      }

      // For English, use address in English
      if (isEnglish) {
        const translatedCity = (cityTranslation as Record<string, string>)[
          pokefuta.city
        ]!;
        const translatedPref = prefs.find(
          (pref) => pref.code === pokefuta.pref
        )!.name;

        if (
          translatedCity.toLowerCase().includes(normalizedSearchTerm) ||
          translatedPref.toLowerCase().includes(normalizedSearchTerm)
        ) {
          return true;
        }
      }
    }

    // By name
    for (const pokeNum of pokefuta.pokemons) {
      if (options.includeEvolutions) {
        if (matchedEvoPokeNums.has(Number(pokeNum.split("-")[0]))) {
          return true;
        }
      } else {
        return pokefuta.pokemons.some((pokeNum) => {
          return getPokemonName(pokeNum, isEnglish)
            ?.toLowerCase()
            .includes(normalizedSearchTerm);
        });
      }
    }
  });
};

// Get nearby pokefutas
export const getNearbyPokefutas = (
  count: number,
  lat: number,
  lng: number,
  options?: {
    filteredPokefutas?: PokefutaData[];
    ignoreId?: number;
  }
) => {
  return (options?.filteredPokefutas ?? data.list)
    .filter((pokefuta) => {
      return !options?.ignoreId || pokefuta.id !== options.ignoreId;
    })
    .map((pokefuta) => {
      const distance = calcDistance(
        Number(lat),
        Number(lng),
        Number(pokefuta.coords[0]),
        Number(pokefuta.coords[1])
      );
      return { ...pokefuta, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
};
