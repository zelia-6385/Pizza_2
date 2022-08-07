import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const initialState = {
  items: [],
  status: 'loading', // loading | success | error
};

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzas', async (params, thunkApi) => {
  const { order, sortBy, category, search, currentPage } = params;
  const { data } = await axios.get(
    // category and search do not work together -> search works on "Все" only -> bug on API
    `https://62e146c3fa99731d75d2f762.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
  );
  return data;
});

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  // reducers: {
  //   setItems(state, action) {
  //     state.items = action.payload;
  //   },
  // },

  // дополнительная работа, проводимая в зависимости от состояния асинхронного экшена
  extraReducers: {
    // сделано не как в документации -> передается ключ, по которому получается функция
    // buiulder предоставляет некий расширеннй функционал
    [fetchPizzas.pending]: (state) => {
      state.status = 'loading';
      state.items = [];
    },
    [fetchPizzas.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = 'success';
    },
    [fetchPizzas.rejected]: (state) => {
      state.status = 'error';
      state.items = [];
    },
  },
});

export const selectPizzaData = (state) => state.pizza;

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
