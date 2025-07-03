import data from "@/data/data.json";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "ja"];

  const normalPages = [
    { path: "" },
    { path: "/map" },
    // { path: "/progress" },
    // { path: "/settings" },
  ].flatMap((page) => {
    return locales.map((loc) => ({
      url: `/${loc}${page.path}`,
    }));
  });
  const itemPages = data.list.flatMap((item) => {
    return locales.map((loc) => ({
      url: `/${loc}/item/${item.id}`,
    }));
  });

  return [...normalPages, ...itemPages];
}
