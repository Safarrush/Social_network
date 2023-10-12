import { createSlice } from "@reduxjs/toolkit";
import { initialData } from "../initialState";

export const meSlice = createSlice({
  name: "me",
  initialState: initialData,
  reducers: {
    setMe: (state, action) => {
      state.me = action.payload;
    },
  },
});
export const { setMe } = meSlice.actions;
export const meReducer = meSlice.reducer;
