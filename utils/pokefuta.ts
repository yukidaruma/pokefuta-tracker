import data from "@/data/data.json";
import prefs from "@/data/prefs.json";
import cityTranslation from "@/data/municipality-translation.json";
import { DATA_VERSION } from "@/utils/constants";

export type PokefutaData = (typeof data.list)[number];

export const getPokefutaImageUrl = (id: number) =>
  `/images/pokefuta/${id}.png?v=${DATA_VERSION}`;

export const getPokefutaData = (id: number) => {
  return data.list.find((item) => item.id === id) ?? null;
};
export const getPokefutaImage = (id: number) => {
  return getPokefutaImageUrl(id);
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
export const normalizePokemonNumber = (pokeNum: string) => {
  return Number(pokeNum.toString().split("-")[0]);
};

// Build a URL for Google Maps navigation
export const buildGoogleMapsNavigationUrl = (
  coords: Array<[lat: number | string, lng: number | string]>
) => {
  const params: Record<string, string> = {
    api: "1",
    destination: coords[coords.length - 1].join(","),
  };
  if (coords.length > 1) {
    params.waypoints = coords
      .slice(0, -1)
      .map((coord) => coord.join(","))
      .join("|");
  }

  return "https://www.google.com/maps/dir/?" + new URLSearchParams(params);
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

// Get nearby pokefutas
export const getNearbyPokefutas = (
  count: number,
  lat: number,
  lng: number,
  options?: {
    filteredPokefutas?: PokefutaData[];
    ignoreId?: number;
    maxDistance?: number; // in km
  }
): Array<
  PokefutaData & {
    distance: number; // in km
  }
> => {
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
    .filter((pokefuta) => {
      return !options?.maxDistance || pokefuta.distance <= options.maxDistance;
    })
    .slice(0, count);
};
