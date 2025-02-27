"use client";

import { configureStore } from '@reduxjs/toolkit';

import ProductReducer from '../store/slices/productSlices';

export const store = configureStore({
  reducer: {
    Products: ProductReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;