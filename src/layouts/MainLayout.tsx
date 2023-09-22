import { createContext, useState, Dispatch, SetStateAction, FC } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "../components";

type SearchContextType = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

const defaultContextState = {
  searchValue: "",
  setSearchValue: () => {},
};

export const SearchContext =
  createContext<SearchContextType>(defaultContextState);

const MainLayout: FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div className="wrapper">
      <SearchContext.Provider value={{ searchValue, setSearchValue }}>
        <Header />
        <div className="content">
          <Outlet />
        </div>
      </SearchContext.Provider>
    </div>
  );
};

export default MainLayout;
