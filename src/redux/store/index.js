/* eslint-disable linebreak-style */
import { configureStore } from '@reduxjs/toolkit';
import ThemeSlice from '../reducers/ThemeSlice';
import ProductSlice from '../reducers/ProductSlice';

const store = configureStore({
  reducer: {
    Theme: ThemeSlice.reducer,
    Product:ProductSlice.reducer
  },

});

export default store;
