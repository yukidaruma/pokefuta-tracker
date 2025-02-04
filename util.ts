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
