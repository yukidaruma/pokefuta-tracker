import data from "@/data.json";
import prefs from "@/prefs.json";

export type PokefutaData = (typeof data.list)[number];

export const getPokefutaData = (id: number) => {
  return data.list.find((item) => item.id === id) ?? null;
};
export const getPokefutaImage = (id: number) => {
  return `/images/pokefuta/${id}.png`;
};
export const getPokemonName = (num: string | number) => {
  return (data.names as Record<string, string>)[num];
};
export const getPrefectureName = (code: string | number) => {
  return prefs.find((pref) => pref.code === Number(code))!.ja;
};

export const calcDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6378.137; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
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
function toRad(Value: number) {
  return (Value * Math.PI) / 180;
}
