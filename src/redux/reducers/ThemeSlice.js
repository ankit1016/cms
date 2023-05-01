/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  spinner: false,
  error: null,
};
const ThemeSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {

    setError(state, action) {
      state.error = action.payload;
    },
    setSpinner(state, action) {
      state.spinner = action.payload;
    },
  },
});

export const ThemeActions = ThemeSlice.actions;

export default ThemeSlice;
