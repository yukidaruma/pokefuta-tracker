"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";

import { getFilteredPokefutas, PokefutaData } from "@/util";
import { useProgressStorage } from "@/hooks";
import { useTranslation } from "@/i18n-client";

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
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex justify-center content-center items-center">
          <span style={{ flexShrink: 0 }}>{t("search")}</span>
          <Mantine.TextInput
            className="ml-2 w-full sm:w-[inital]"
            type="text"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            leftSection={<Lucide.Search className="text-gray-400" />}
          />
        </div>
        <span className="ml-12 mt-2 sm:ml-2 sm:mt-0 text-sm text-gray-500">
          {t("search_example")}
        </span>
      </div>

      <div className="mt-2 flex items-center space-x-2">
        <Mantine.Checkbox
          id="hide-visited"
          checked={hideVisited}
          onChange={(e) => setHideVisited(e.target.checked)}
        />
        <label htmlFor="hide-visited">{t("search_exclude_visited")}</label>
      </div>

      <div className="mt-2 flex items-center space-x-2">
        <Mantine.Checkbox
          id="include-evolution"
          checked={includeEvolutions}
          onChange={(e) => setIncludeEvolutions(e.target.checked)}
        />
        <label htmlFor="include-evolution">{t("search_include_evos")}</label>
      </div>

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
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [hideVisited, setHideVisited] = React.useState<boolean>(false);
  const [includeEvolutions, setIncludeEvolutions] =
    React.useState<boolean>(false);

  const [progress, updateProgress, resetProgress] = useProgressStorage();

  const filteredPokefutas = React.useMemo(() => {
    return getFilteredPokefutas(searchTerm, {
      progress,
      hideVisited,
      includeEvolutions,
    });
  }, [searchTerm, progress, hideVisited, includeEvolutions]);
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
