"use client";

import React from "react";

import { PokefutaCard } from "@/components/pokefuta-card";
import { useTranslation } from "@/i18n/client";
import { SearchContext, useSearchContext } from "@/providers/search";
import { getPrefectureByCode, type PokefutaData } from "@/utils/pokefuta";

const IndexClientPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { progress, updateProgress } = useSearchContext();
  const [selectedGroup, setSelectedGroup] = React.useState<string>(null!);

  const groupByOptions = [
    { value: "pref", label: "Prefecture" },
    // { value: "generation", label: "Generation" },
  ] as const;
  type GroupByOption = (typeof groupByOptions)[number]["value"];
  const [groupBy, setGroupBy] = React.useState<GroupByOption>(
    groupByOptions[0].value
  );

  // Workaround for sticky header
  const scrollToGroup = (element: HTMLElement) => {
    window.scrollTo({
      top: element.offsetTop - 66,
    });
  };

  React.useEffect(() => {
    const hash = location.hash.slice(1);
    const targetEl = document.getElementById(hash);
    if (!targetEl) {
      return;
    }

    setSelectedGroup(hash);
    setTimeout(() => {
      scrollToGroup(targetEl);
    }, 0);
  }, []);

  React.useEffect(() => {
    if (!selectedGroup) {
      return;
    }

    location.hash = selectedGroup;
    scrollToGroup(document.getElementById(selectedGroup)!);
  }, [selectedGroup]);

  const isEnglish = i18n.language === "en";

  return (
    <SearchContext.Consumer>
      {({ form, filteredPokefutas }) => {
        const groupedPokefutas = filteredPokefutas.reduce(
          (acc, pokefuta) => {
            const gruopKey = pokefuta.pref;
            acc[gruopKey] ??= [];
            acc[gruopKey].push(pokefuta);
            return acc;
          },
          {} as Record<string, PokefutaData[]>
        );

        return (
          <div className="space-y-4 w-full">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">
                {t("title_list")}
              </h2>
            </div>

            {form}

            {Object.entries(groupedPokefutas).map(([group, items], i) => {
              const prefecture = getPrefectureByCode(group)!;
              const groupAsNumber = Number(group);
              const groupProgress = items.reduce((acc, pokefuta) => {
                if (pokefuta.pref === groupAsNumber) {
                  return acc + (progress[pokefuta.id] ? 1 : 0);
                }
                return acc;
              }, 0);

              return (
                <div
                  id={prefecture.name}
                  key={group}
                  className={"space-y-2" + (i > 0) ? "mt-8" : ""}
                >
                  <div className="flex items-center space-x-2">
                    <h3
                      className="text-2xl text-red-700 font-bold cursor-pointer hover:underline"
                      onClick={() => setSelectedGroup(prefecture.name)}
                    >
                      <a
                        href={`#${prefecture.name}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        {(t as any)(`pref_${getPrefectureByCode(group)!.name}`)}
                      </a>
                    </h3>
                    <span className="text-gray-500">
                      ({groupProgress} / {items.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((pokefuta) => {
                      return (
                        <PokefutaCard
                          key={pokefuta.id}
                          isEnglish={isEnglish}
                          pokefuta={pokefuta}
                          progress={progress}
                          updateProgress={updateProgress}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    </SearchContext.Consumer>
  );
};

export default IndexClientPage;
