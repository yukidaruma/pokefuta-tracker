import data from "@/data/data.json";
import { locales } from "@/i18n/constants";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const normalPages = [
    { path: "" },
    { path: "/map" },
    { path: "/progress" },
    { path: "/settings" },
  ].flatMap((page) => {
    return locales.map((loc) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${loc}${page.path}`,
    }));
  });
  const itemPages = data.list.flatMap((item) => {
    return locales.map((loc) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${loc}/item/${item.id}`,
    }));
  });

  return [...normalPages, ...itemPages].map((page) => {
    return {
      ...page,
      url: page.url.replaceAll(/[^:]\/\//g, "/"),
    };
  });
}
