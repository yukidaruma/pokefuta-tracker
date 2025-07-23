"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";

import data from "@/data/data.json";
import cityTranslation from "@/data/municipality-translation.json";
import { useTranslation } from "@/i18n/client";
import { useProgressStorage } from "@/utils/hooks";
import { normalizeKana, PokefutaData, unique } from "@/utils/pokefuta";
import { FilterTuple, getFilteredPokefutas } from "@/utils/pokefuta-filter";

type SearchFieldsProps = {
  searchTerm: string;
  hideVisited: boolean;
  includeEvolutions: boolean;
  setSearchTerm: (term: string) => void;
  setHideVisited: (hide: boolean) => void;
  setIncludeEvolutions: (include: boolean) => void;
  filteredPokefutas: PokefutaData[];
  progression: number;
};

const SearchFields: React.FC<SearchFieldsProps> = ({
  searchTerm,
  hideVisited,
  includeEvolutions,
  setSearchTerm,
  setHideVisited,
  setIncludeEvolutions,
  filteredPokefutas,
  progression,
}) => {
  const [popupOpened, setPopupOpened] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const { t, i18n } = useTranslation();

  type SearchIndex = [normalized: string, original: string];
  const normalizedSearchTerm = normalizeKana(searchTerm).toLowerCase();
  const searchIndexes = React.useMemo(() => {
    const prefNames = Object.entries(
      (i18n.getResourceBundle(i18n.language, "common") ?? {}) as Record<
        string,
        string
      >
    ).flatMap(([key, value]) => (key.startsWith("pref_") ? [value] : []));
    let indexes =
      i18n.language === "en"
        ? [
            ...Object.values(data.namesEn),
            ...prefNames,
            ...Object.values(cityTranslation),
          ]
        : [
            ...Object.values(data.names),
            ...prefNames,
            ...Object.keys(cityTranslation),
          ];

    // For English, normalize by converting letter case
    // For Japanese, search target is already normalied
    // Pokemons like "チェリム" has 2 forms with identical name, so we need to make them unique
    return unique(indexes).map(
      (phrase) => [phrase.toLowerCase(), phrase] as SearchIndex
    );
  }, [i18n.language]);
  const suggestions = React.useMemo(() => {
    return searchIndexes
      .filter(([normalized]) => normalized.startsWith(normalizedSearchTerm))
      .map(([_, original]) => original);
  }, [searchIndexes, normalizedSearchTerm]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex justify-center content-center items-center">
          <span style={{ flexShrink: 0 }}>{t("search")}</span>

          {/* Show suggestions based on searchTerm */}
          <Mantine.Popover
            opened={popupOpened}
            width="target"
            position="bottom"
          >
            <Mantine.Popover.Target>
              <Mantine.TextInput
                className="ml-2 w-full sm:w-72"
                type="text"
                value={searchTerm}
                onFocus={() => setPopupOpened(true)}
                onBlur={() => setPopupOpened(false)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                leftSection={<Lucide.Search className="text-gray-400" />}
              />
            </Mantine.Popover.Target>
            <Mantine.Popover.Dropdown>
              {searchTerm.trim().length === 0 ? (
                <span className="text-gray-500">
                  {t("search_suggestions_hint")}
                </span>
              ) : suggestions.length === 0 ? (
                <span className="text-gray-500">
                  {t("search_suggestions_empty")}
                </span>
              ) : (
                <div>
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <button
                      key={suggestion}
                      className="block w-full cursor-pointer text-left p-2 rounded-sm hover:bg-gray-200"
                      onClick={() => setSearchTerm(suggestion)}
                    >
                      {/* TODO: Only highlight starting letters */}
                      <Mantine.Highlight
                        highlight={normalizedSearchTerm}
                        highlightStyles={{ fontWeight: "bold" }}
                      >
                        {suggestion}
                      </Mantine.Highlight>
                    </button>
                  ))}
                </div>
              )}
            </Mantine.Popover.Dropdown>
          </Mantine.Popover>
        </div>
        <span className="ml-12 mt-2 sm:ml-2 sm:mt-0 text-sm text-gray-500">
          {/* Even though we can search by Pokedex number, we don't show it here */}
          {t("search_example")}
        </span>
      </div>

      <div className="mt-2 flex items-center space-x-2">
        <Mantine.Button
          variant="transparent"
          size="sm"
          className="!px-0 h-auto font-normal"
          onClick={() => setShowOptions(!showOptions)}
          rightSection={
            showOptions ? (
              <Lucide.ChevronUp size={16} />
            ) : (
              <Lucide.ChevronDown size={16} />
            )
          }
        >
          {t("search_options")}
        </Mantine.Button>
        {!showOptions && (hideVisited || includeEvolutions) && (
          <span className="text-sm text-gray-500">
            {t("search_options_active")}
          </span>
        )}
      </div>

      {showOptions && (
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Mantine.Checkbox
              id="hide-visited"
              checked={hideVisited}
              onChange={(e) => setHideVisited(e.target.checked)}
            />
            <label htmlFor="hide-visited">{t("search_exclude_visited")}</label>
          </div>

          <div className="flex items-center space-x-2">
            <Mantine.Checkbox
              id="include-evolution"
              checked={includeEvolutions}
              onChange={(e) => setIncludeEvolutions(e.target.checked)}
            />
            <label htmlFor="include-evolution">
              {t("search_include_evos")}
            </label>
          </div>
        </div>
      )}

      <div className="mt-8"></div>

      <p className="mt-2 text-gray-500">
        {t("search_found")}: {filteredPokefutas.length}{" "}
        {hideVisited || `(${t("visited")}: ${progression})`}
      </p>
    </div>
  );
};

export default SearchFields;
type SearchContextProps = {
  searchTerm: string;
  hideVisited: boolean;
  includeEvolutions: boolean;
  setSearchTerm: (term: string) => void;
  setHideVisited: (hide: boolean) => void;
  setIncludeEvolutions: (include: boolean) => void;
  filteredPokefutas: PokefutaData[];
  form: React.ReactNode;
  progress: Record<string, boolean>;
  updateProgress: (id: number, visited: boolean) => void;
  resetProgress: () => void;
};

const SearchContext = React.createContext<SearchContextProps>(
  {} as SearchContextProps
);

const SearchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [hideVisited, setHideVisited] = React.useState<boolean>(false);
  const [includeEvolutions, setIncludeEvolutions] =
    React.useState<boolean>(false);

  const [progress, updateProgress, resetProgress] = useProgressStorage();

  const filteredPokefutas = React.useMemo(() => {
    const filters: FilterTuple[] = hideVisited ? [["visited", "false"]] : [];
    return getFilteredPokefutas(searchTerm, filters, {
      language: i18n.language,
      progress,
      includeEvolutions,
    });
  }, [i18n.language, searchTerm, progress, hideVisited, includeEvolutions]);
  const filteredProgression = Object.entries(progress).filter(
    ([id, visited]) => {
      return (
        visited &&
        filteredPokefutas.map((pokefuta) => pokefuta.id).includes(Number(id))
      );
    }
  ).length;

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        hideVisited,
        includeEvolutions,
        setSearchTerm,
        setHideVisited,
        setIncludeEvolutions,
        filteredPokefutas,
        progress,
        updateProgress,
        resetProgress,
        form: (
          <SearchFields
            searchTerm={searchTerm}
            hideVisited={hideVisited}
            includeEvolutions={includeEvolutions}
            setSearchTerm={setSearchTerm}
            setHideVisited={setHideVisited}
            setIncludeEvolutions={setIncludeEvolutions}
            filteredPokefutas={filteredPokefutas}
            progression={filteredProgression}
          />
        ),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

const useSearchContext = () => React.useContext(SearchContext);

export { SearchContext, SearchProvider, useSearchContext };
