"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";

import { getFilteredPokefutas, PokefutaData } from "@/util";
import { useProgressStorage } from "@/hooks";

type SearchFieldsProps = {
  searchTerm: string;
  hideVisited: boolean;
  setSearchTerm: (term: string) => void;
  setHideVisited: (hide: boolean) => void;
  filteredPokefutas: PokefutaData[];
  progression: number;
};

const SearchFields: React.FC<SearchFieldsProps> = ({
  searchTerm,
  hideVisited,
  setSearchTerm,
  setHideVisited,
  filteredPokefutas,
  progression,
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex justify-center content-center items-center">
          <span style={{ flexShrink: 0 }}>検索</span>
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
          例: 「ピカチュウ」「北海道」
        </span>
      </div>

      <div className="mt-2 flex items-center space-x-2">
        <Mantine.Checkbox
          id="hide-visited"
          checked={hideVisited}
          onChange={(e) => setHideVisited(e.target.checked)}
        />
        <label htmlFor="hide-visited">訪問済みのポケふたを除外する</label>
      </div>

      <div className="mt-8"></div>

      <p className="mt-2 text-gray-500">
        検索結果: {filteredPokefutas.length}{" "}
        {hideVisited || `(訪問済み: ${progression})`}
      </p>
    </div>
  );
};

export default SearchFields;
type SearchContextProps = {
  searchTerm: string;
  hideVisited: boolean;
  setSearchTerm: (term: string) => void;
  setHideVisited: (hide: boolean) => void;
  filteredPokefutas: PokefutaData[];
  form: React.ReactNode;
};

const SearchContext = React.createContext<SearchContextProps>(
  {} as SearchContextProps
);

const SearchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [hideVisited, setHideVisited] = React.useState<boolean>(false);

  const [progress, _updateProgress] = useProgressStorage();

  const filteredPokefutas = React.useMemo(() => {
    return getFilteredPokefutas(searchTerm, { progress, hideVisited });
  }, [searchTerm, progress, hideVisited]);
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
        setSearchTerm,
        setHideVisited,
        filteredPokefutas,
        form: (
          <SearchFields
            hideVisited={hideVisited}
            setSearchTerm={setSearchTerm}
            setHideVisited={setHideVisited}
            searchTerm={searchTerm}
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
