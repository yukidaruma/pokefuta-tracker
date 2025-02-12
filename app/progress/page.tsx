"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";
import ReactMapJapan from "@react-map/japan";

import data from "@/data/data.json";
import prefs from "@/data/prefs.json";
import { useProgressStorage } from "@/hooks";
import { getPrefectureByCode, PokefutaData } from "@/util";
import Link from "next/link";
import { useRouter } from "next/navigation";

const regionNames = {
  tohoku: "北海道・東北",
  kanto: "関東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州・沖縄",
} as Record<string, string>;

const svgToImage = async (element: SVGElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // The size ratio of the SVG map measured in DevTools is 960x1133.
  canvas.width = 960;
  canvas.height = 1133;

  // Draw SVG map to canvas
  //
  // The library has stroke style on the container <div>,
  // so we need to add it to the <svg> element when converting to image
  const svgString = new XMLSerializer()
    .serializeToString(element)
    .replace(
      "<svg ",
      `<svg style="stroke: black; stroke-width: 0.5; width: 960px" `
    );
  const img = new Image();
  await new Promise((resolve) => {
    img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
    img.onload = resolve;
    img.onerror = console.error;
  });
  ctx.drawImage(img, 0, 0, 960, 1133);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, "image/png");
  });
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const ProgressPage = () => {
  const [progress, _updateProgress] = useProgressStorage();

  const colors = React.useMemo(() => {
    const found = {} as Record<number, boolean>;
    for (const pokefuta of data.list) {
      found[pokefuta.pref] = true;
    }
    const prefsWithoutPokefutas = prefs
      .filter((pref) => !found[pref.code])
      .map((pref) => pref.code);

    return prefs.reduce((acc, pref) => {
      const capitalizedPrefName = capitalize(pref.name);

      // Gray out the prefectures without pokefutas
      if (prefsWithoutPokefutas.includes(pref.code)) {
        acc[capitalizedPrefName] = "gray";
        return acc;
      }

      // Color the prefectures based on the ratio of visited pokefutas
      //
      // 0%: Red
      // 1-99%: Yellow
      // 100%: Green
      const pokefutasInPref = data.list.filter(
        (pokefuta) => pokefuta.pref === pref.code
      );
      const visitedPokefutas = pokefutasInPref.filter(
        (pokefuta) => progress[pokefuta.id]
      );
      const visitedRatio = visitedPokefutas.length / pokefutasInPref.length;

      acc[capitalizedPrefName] =
        visitedRatio === 0
          ? "#ff6e66"
          : visitedRatio < 1
          ? "#f8d772"
          : "#90d582";
      return acc;
    }, {} as Record<string, string>);
  }, [progress]);

  const copyImage = async () => {
    const image = await svgToImage(
      document.querySelector(".map > svg")! as SVGElement
    );

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": image,
      }),
    ]);
  };

  const shareProgression = async () => {
    const image = await svgToImage(
      document.querySelector(".map > svg")! as SVGElement
    );

    const progression = Object.keys(progress).length;
    await navigator.share({
      text: `${progression} / ${data.list.length} のポケふたを訪問しました！\n\n#ポケふた #PokefutaTracker`,
      files: [new File([image], "map.png", { type: "image/png" })],
    });
  };

  const groupedPokefutas = data.list.reduce((acc, pokefuta) => {
    const gruopKey = getPrefectureByCode(pokefuta.pref)!.region;
    acc[gruopKey] ??= [];
    acc[gruopKey].push(pokefuta);
    return acc;
  }, {} as Record<string, PokefutaData[]>);

  const router = useRouter();

  return (
    <div className="flex-1">
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">訪問状況</h2>
      <div className="block lg:flex flex-1 space-x-4">
        <div className="max-w-[480px] w-full flex flex-col space-y-4 margin-x-auto">
          <ReactMapJapan
            type="select-single"
            onSelect={(selectedPref) => {
              if (!selectedPref) {
                return;
              }

              const lowerCaseSelectedPref = selectedPref.toLowerCase();
              const hasPokefutaInPref = data.list.some(
                (pokefuta) =>
                  getPrefectureByCode(pokefuta.pref)!.name ===
                  lowerCaseSelectedPref
              );
              if (!hasPokefutaInPref) {
                return;
              }

              router.push(`/#${lowerCaseSelectedPref}`);
            }}
            cityColors={colors}
          />

          <div className="flex flex-wrap space-x-4 justify-center max-w-[480px]">
            <Mantine.Button
              className="hidden! sm:inline-block!"
              leftSection={<Lucide.Copy size={24} />}
              onClick={copyImage}
            >
              画像をコピー
            </Mantine.Button>

            <Mantine.Button
              leftSection={<Lucide.Share size={24} />}
              onClick={shareProgression}
            >
              共有
            </Mantine.Button>
          </div>
        </div>

        <Mantine.Accordion
          className="flex-1 mt-4 sm:mt-0"
          defaultValue="hokkaido"
        >
          {Object.entries(groupedPokefutas).map(([group, items]) => {
            const groupProgress = items.reduce((acc, pokefuta) => {
              if (getPrefectureByCode(pokefuta.pref)!.region === group) {
                return acc + (progress[pokefuta.id] ? 1 : 0);
              }
              return acc;
            }, 0);
            const groupedByPrefecture = items.reduce((acc, pokefuta) => {
              acc[pokefuta.pref] ??= [];
              acc[pokefuta.pref].push(pokefuta);
              return acc;
            }, {} as Record<number, PokefutaData[]>);

            const percentage = (groupProgress / items.length) * 100;
            return (
              <Mantine.AccordionItem key={group} value={group}>
                <Mantine.Accordion.Control>
                  <div className="flex items-center justify-between">
                    <span className="text-red-700 font-bold">
                      {regionNames[group]}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Mantine.Progress w={60} color="red" value={percentage} />
                      <span className="text-sm w-12 font-bold text-center">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </Mantine.Accordion.Control>
                <Mantine.Accordion.Panel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(groupedByPrefecture).map(
                      ([pref, pokefutas]) => {
                        const prefecture = getPrefectureByCode(Number(pref));
                        const prefProgress = pokefutas.reduce(
                          (acc, pokefuta) => {
                            return acc + (progress[pokefuta.id] ? 1 : 0);
                          },
                          0
                        );
                        const percentage =
                          (prefProgress / pokefutas.length) * 100;
                        return (
                          <Link
                            href={`/#${prefecture!.name}`}
                            key={pref}
                            className="flex items-center p-2 space-x-2 rounded-lg shadow cursor-pointer"
                          >
                            <span className="font-bold hover:underline">
                              {prefecture!.ja}
                            </span>
                            <span className="flex-1"></span>
                            <Mantine.Progress
                              w={60}
                              color="red"
                              value={percentage}
                            />
                            <div className="text-sm w-10 text-right">
                              {percentage.toFixed(0)}%
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </Mantine.Accordion.Panel>
              </Mantine.AccordionItem>
            );
          })}
        </Mantine.Accordion>
      </div>
    </div>
  );
};

export default ProgressPage;
