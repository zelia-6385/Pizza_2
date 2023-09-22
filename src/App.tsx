import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loadable from "react-loadable";

import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";

import "./scss/app.scss";

// lazy подгрузит компонент только тогда, когда будет необходимо его отрендерить
// Loadable в отличие от lazy умеет лениво подгружать код и в браузере и на стороне сервера, т.е. может использоваться при SSR
const Cart = Loadable({
  loader: () => import(/* webpackChunkName: "Cart" */ "./pages/Cart"),
  loading: () => <div>Загрузка...</div>,
});
const FullPizza = lazy(
  () => import(/* webpackChunkName: "FullPizza" */ "./pages/FullPizza")
);
const NotFound = lazy(
  () => import(/* webpackChunkName: "NotFound" */ "./pages/NotFound")
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route
          path="pizza/:id"
          element={
            <Suspense fallback={<div>Загрузка...</div>}>
              <FullPizza />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Загрузка...</div>}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
