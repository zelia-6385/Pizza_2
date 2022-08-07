import { useCallback, useContext, useRef, useState } from 'react';
import { debounce } from 'lodash';

import { SearchContext } from '../../App';

import styles from './Search.module.scss';

const Search = () => {
  // локальный контролируемый инпут (отвечает за быстрое отображение данных в инпуте)
  const [value, setValue] = useState('');

  // отложенная через debounce запись инпута (используется в другом компоненте для отправки запроса)
  const { setSearchValue } = useContext(SearchContext);

  const inputRef = useRef(null);

  const onClickClear = () => {
    setSearchValue('');
    setValue('');
    inputRef.current.focus();
  };

  // const fireDebounce = () => debounce(setSearchValue, 250);

  // useCallback позволяет не пересоздавать функцию при каждом обновлении компонента (сохраняется ссылка на функцию). Только в этом случае debounce работает корректно
  const updateSearchValue = useCallback(debounce(setSearchValue, 1000), []);

  const onChangeInput = (event) => {
    setValue(event.target.value);
    updateSearchValue(event.target.value);
  };

  return (
    <div className={styles.root}>
      <svg className={styles.icon} id="Layer_1" version="1.1" viewBox="0 0 64 64">
        <g>
          <g id="Icon-Search" transform="translate(30.000000, 230.000000)">
            <path
              d="M-2.3-182.9c-10.7,0-19.5-8.7-19.5-19.5c0-10.7,8.7-19.5,19.5-19.5s19.5,8.7,19.5,19.5     C17.1-191.6,8.4-182.9-2.3-182.9L-2.3-182.9z M-2.3-219c-9.2,0-16.7,7.5-16.7,16.7c0,9.2,7.5,16.7,16.7,16.7s16.7-7.5,16.7-16.7     C14.3-211.5,6.8-219-2.3-219L-2.3-219z"
              id="Fill-1"
            />
            <polyline
              id="Fill-2"
              points="23.7,-174.2 10.1,-187.7 12.3,-189.9 25.8,-176.3 23.7,-174.2    "
            />
          </g>
        </g>
      </svg>
      <input
        ref={inputRef}
        value={value}
        onChange={onChangeInput}
        className={styles.input}
        placeholder="Поиск пиццы ..."
      />
      {value && (
        <svg
          onClick={onClickClear}
          className={styles.clearIcon}
          data-name="Capa 1"
          id="Capa_1"
          viewBox="0 0 20 19.84"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M10.17,10l3.89-3.89a.37.37,0,1,0-.53-.53L9.64,9.43,5.75,5.54a.37.37,0,1,0-.53.53L9.11,10,5.22,13.85a.37.37,0,0,0,0,.53.34.34,0,0,0,.26.11.36.36,0,0,0,.27-.11l3.89-3.89,3.89,3.89a.34.34,0,0,0,.26.11.35.35,0,0,0,.27-.11.37.37,0,0,0,0-.53Z" />
        </svg>
      )}
    </div>
  );
};
export default Search;
