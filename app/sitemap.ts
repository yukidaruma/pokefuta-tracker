import data from "@/data/data.json";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "ja"];
  return data.list.flatMap((item) => {
    return locales.map((loc) => ({
      url: `/${loc}/item/${item.id}`,
    }));
  });
}
