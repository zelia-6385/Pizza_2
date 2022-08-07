import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header';

export const SearchContext = createContext('');

const MainLayout = () => {
  const [searchValue, setSearchValue] = useState('');

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
