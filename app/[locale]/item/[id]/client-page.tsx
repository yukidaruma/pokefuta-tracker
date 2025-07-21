"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";

import data from "@/data/data.json";
import evolutions from "@/data/evolutions.json";
import Copyable from "@/components/copyable";
import ExternalLink from "@/components/external-link";
import MapComponent from "@/components/map";
import PokefutaImage from "@/components/pokefuta-image";
import PokefutasNearby, {
  DEFAULT_POKEFUTAS_NEARBY_COUNT,
} from "@/components/pokefutas-nearby";
import { useTranslation } from "@/i18n-client";
import { useSearchContext } from "@/providers/search";
import {
  buildGoogleMapsNavigationUrl,
  getPokefutaData,
  getPokemonNamesCombined,
  getPrefectureByCode,
  getTranslatedCityName,
  normalizePokemonNumber,
} from "@/util";

const ItemClientPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const params = useParams()!;
  const [currentId, setCurrentId] = useState(Number(params.id as string));
  const pokefutaData = getPokefutaData(currentId)!;

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const newId = Number(window.location.pathname.split("/").pop());
      if (newId && getPokefutaData(newId)) {
        setCurrentId(newId);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigation function using History API
  const navigateToItem = (newId: number) => {
    const locale = params.locale as string;
    const newPath = `/${locale}/item/${newId}`;

    // Update URL without full page reload
    window.history.pushState({ id: newId }, "", newPath);

    // Update local state
    setCurrentId(newId);
  };

  const [showAll, setShowAll] = useState(false);
  const { progress, updateProgress } = useSearchContext();
  const hasVisited = progress[currentId];
  const toggleVisited = () => {
    updateProgress(currentId, !hasVisited);
  };

  const [lat, lng] = pokefutaData.coords;
  const isEnglish = i18n.language === "en";

  const evolutionFamilyPokefutas = useMemo(() => {
    const familyPokemonNumbers = new Set();

    const pokemonNumbers = pokefutaData.pokemons.map(normalizePokemonNumber);
    outer: for (const evolutionChain of evolutions) {
      for (const pokeNum of evolutionChain) {
        if (pokemonNumbers.includes(pokeNum)) {
          for (const pokeNum2 of evolutionChain) {
            familyPokemonNumbers.add(pokeNum2);
          }
          continue outer;
        }
      }
    }

    return data.list.filter((pokefuta) => {
      return (
        pokefuta.id !== currentId && // Exclude current Pokéfuta
        pokefuta.pokemons.some((pokeNum) =>
          familyPokemonNumbers.has(normalizePokemonNumber(pokeNum))
        )
      );
    });
  }, [currentId]);

  return (
    <div className="flex flex-col flex-1 space-y-4">
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold whitespace-pre-line md:whitespace-normal">
        {t("title_item_address", {
          pref: (t as any)(
            `pref_${getPrefectureByCode(pokefutaData.pref)!.name}`
          ),
          city: getTranslatedCityName(pokefutaData.city, isEnglish),
        })}
        <span className="sm:hidden">{"\n"}</span>
        <span className="hidden sm:inline"> - </span>
        {t("title_item_pokemons", {
          pokemons: getPokemonNamesCombined(pokefutaData.pokemons, isEnglish),
        })}
      </h2>

      <div className="flex flex-col md:flex-row">
        <div className="flex self-start justify-center flex-1 mx-auto max-w-[480px]">
          <div className="sm:hidden">
            <PokefutaImage id={currentId} size={200} />
          </div>
          <div className="hidden sm:block md:hidden">
            <PokefutaImage id={currentId} size={280} />
          </div>
          <div className="hidden md:block">
            <PokefutaImage id={currentId} size={360} />
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex-1">
          <MapComponent
            style={{ height: 450 }}
            highlight={currentId}
            navigate={navigateToItem}
          />
          <div className="mt-4 flex flex-col space-y-4">
            <Copyable
              value={pokefutaData.address}
              copyMessage="住所をコピーしました"
            >
              <div className="flex items-center space-x-1">
                <Lucide.MapPin color="gray" />
                <span>{pokefutaData.address}</span>
              </div>
            </Copyable>

            <Copyable
              value={`${lat}, ${lng}`}
              copyMessage="座標をコピーしました"
            >
              <div className="flex items-center space-x-1">
                <Lucide.Globe color="gray" />
                <span>
                  {lat}, {lng}
                </span>
              </div>
            </Copyable>

            <div className="flex items-center space-x-1">
              <Lucide.ExternalLink color="gray" />
              <ExternalLink
                href={`https://local.pokemon.jp/${
                  isEnglish ? "en/" : ""
                }manhole/desc/${currentId}/`}
              >
                {t("link_to_official_pokefuta_page")}
              </ExternalLink>
            </div>

            <div className="flex items-center space-x-1">
              <Lucide.ExternalLink color="gray" />
              <ExternalLink
                href={`https://www.google.co.jp/maps/?q=${lat}+${lng}`}
              >
                Google Maps
              </ExternalLink>
            </div>

            <div className="flex items-center space-x-1">
              <Lucide.ExternalLink color="gray" />
              <ExternalLink
                href={buildGoogleMapsNavigationUrl([
                  pokefutaData.coords as [string, string],
                ])}
              >
                {t("link_to_google_maps_navigation")}
              </ExternalLink>
            </div>

            {hasVisited ? (
              <Mantine.Button
                leftSection={<Lucide.X />}
                color="red"
                onClick={toggleVisited}
              >
                <span>{t("to_mark_as_unvisited")}</span>
              </Mantine.Button>
            ) : (
              <Mantine.Button
                leftSection={<Lucide.Check />}
                onClick={toggleVisited}
              >
                <span>{t("to_mark_as_visited")}</span>
              </Mantine.Button>
            )}

            <Mantine.Divider className="my-6" />

            <h4 className="font-bold">{t("pokefutas_nearby")}</h4>
            <PokefutasNearby
              pokefutaData={pokefutaData}
              maxDistance={150}
              navigate={navigateToItem}
            />

            <div className="flex items-center">
              <h4 className="font-bold">
                <span>{t("pokefutas_of_evolution_family")}</span>
                <span className="text-xs">
                  ({evolutionFamilyPokefutas.length})
                </span>
              </h4>
              {!showAll &&
                evolutionFamilyPokefutas.length >
                  DEFAULT_POKEFUTAS_NEARBY_COUNT && (
                  <Mantine.Button
                    className="ml-2"
                    variant="subtle"
                    size="compact-xs"
                    onClick={() => setShowAll(true)}
                  >
                    {t("show_all")}
                  </Mantine.Button>
                )}
            </div>

            <PokefutasNearby
              pokefutaData={pokefutaData}
              filteredPokefutas={evolutionFamilyPokefutas}
              count={
                showAll
                  ? Number.MAX_SAFE_INTEGER
                  : DEFAULT_POKEFUTAS_NEARBY_COUNT
              }
              navigate={navigateToItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemClientPage;
