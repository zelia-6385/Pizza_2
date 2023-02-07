import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../store";

type PizzaItemType = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sizes: number[];
  types: number[];
};

enum Status {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export type SearchPizzaParamsType = {
  order: string;
  sortBy: string;
  category: string;
  search: string;
  currentPage: string;
};

interface PizzaSliceStateInterface {
  items: PizzaItemType[];
  status: Status;
}

export const initialState: PizzaSliceStateInterface = {
  items: [],
  status: Status.LOADING, // loading | success | error
};

export const fetchPizzas = createAsyncThunk<
  PizzaItemType[],
  SearchPizzaParamsType
>("pizza/fetchPizzas", async (params) => {
  const { order, sortBy, category, search, currentPage } = params;
  const { data } = await axios.get<PizzaItemType[]>(
    // category and search do not work together -> search works on "Все" only -> bug on API
    `https://62e146c3fa99731d75d2f762.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
  );
  return data;
});

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchPizzas.pending, (state, action) => {
      state.status = Status.LOADING;
      state.items = [];
    });
    builder.addCase(fetchPizzas.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.items = action.payload;
    });
    builder.addCase(fetchPizzas.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.items = [];
    });
  },
});

export const selectPizzaData = (state: RootState) => state.pizza;

// export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
