import { useEffect, useContext, useRef, FC, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import qs from "qs";
import { isEqual } from "lodash";

import { useAppDispatch } from "../redux/store";

import Categories from "../components/Categories";
import PizzaBlock from "../components/PizzaBlock";
import Sort, { sortList } from "../components/Sort";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";

import { SearchContext } from "../layouts/MainLayout";

import {
  setCategoryId,
  setCurrentPage,
  setFilters,
  initialState,
  selectFilter,
} from "../redux/slices/filterSlice";
import {
  fetchPizzas,
  SearchPizzaParamsType,
  selectPizzaData,
} from "../redux/slices/pizzaSlice";

const Home: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { categoryId, sort, currentPage } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const { searchValue } = useContext(SearchContext);

  const onChangeCategory = useCallback(
    (id: number) => dispatch(setCategoryId(id)),
    []
  );

  const onChangePage = (page: number) => dispatch(setCurrentPage(page));

  const getPizzas = async () => {
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const sortBy = sort.sortProperty.replace("-", "");
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    // асинхронный экшен для получения данных
    dispatch(
      fetchPizzas({
        order,
        sortBy,
        category,
        search,
        currentPage: String(currentPage),
      })
    );

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // логика для qs (используем эту библиотеку для добавления данных в query-строку)
    // isMounted предотвращает передачу query-параметров в строку при первом рендере (когда не было еще действий по фильтрациям)
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }

    // после первого рендера рефа переходит в true -> к сожалении делается каждый раз при срабатывании useEffect
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, currentPage]);

  // При первом рендере проверяем наличие параметров в строке и при успехе сохраняем их в стор
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(
        window.location.search.substring(1)
      ) as SearchPizzaParamsType;

      const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);

      const preparedPayload = {
        ...params,
        sort: sort || sortList[0],
      };

      const comparedPayload = {
        ...preparedPayload,
        categoryId: Number(categoryId),
        currentPage: Number(currentPage),
      };

      // @ts-ignore
      delete comparedPayload["sortProperty"];

      // сохраняем данные из query-строки в стор
      // dispatch заставляет компонент снова перерисоваться и запускает работу соответствующих useEffect-ов -> следующий рендер после рендера с дефолтными параметрами, когда данные в сторе изменились
      dispatch(setFilters(comparedPayload));

      if (!isEqual(initialState, comparedPayload)) {
        isSearch.current = true;
      }
    }
  }, []);

  useEffect(() => {
    // isSearch предотвращает первый рендер с дефолтными параметрами (initState)
    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  // create 4 fake skeletons
  const skeletons = [...new Array(4)].map((_, idx) => <Skeleton key={idx} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка!</h2>
          <p>Не удалось получить данные! Попробуйте повторить попытку позже</p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
