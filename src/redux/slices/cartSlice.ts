import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { getCartFromLocalStorage } from "../../utils/getCartFromLocalStorage";
import { calcTotalPrice } from "../../utils/calcTotalPrice";

export type CartItemType = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  count: number;
  // type: string;
  // size: number;
};

interface CartSliceStateInterface {
  totalPrice: number;
  items: CartItemType[];
}

const { items, totalPrice } = getCartFromLocalStorage();

export const initialState: CartSliceStateInterface = {
  totalPrice,
  items,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItemType>) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }

      state.totalPrice = calcTotalPrice(state.items);
    },
    minusItem(state, action: PayloadAction<string>) {
      const findItem = state.items.find((obj) => obj.id === action.payload);

      if (findItem && findItem.count > 0) {
        findItem.count--;
      }

      state.totalPrice = state.items.reduce(
        (sum, obj) => obj.price * obj.count + sum,
        0
      );
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((obj) => obj.id !== action.payload);

      if (!state.items.length) {
        state.totalPrice = 0;
      }
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

// создание селектора
export const selectCart = (state: RootState) => state.cart;
// создание селектора с нагрузкой -> замыкание
export const selectCartItemById = (id: string) => (state: RootState) =>
  state.cart.items.find((obj) => obj.id === id);

export const { addItem, minusItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
