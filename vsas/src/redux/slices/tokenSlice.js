import { createSlice } from "@reduxjs/toolkit";
import { initialData } from "../initialState";

export const tokenSlice = createSlice({
  name: "token",
  initialState: initialData.token,
  reducers: {
    setToken: (_, action) => {
      return action.payload;
    },
    cleanToken: () => {
      return initialData;
    },
  },
});

export const { setToken, cleanToken } = tokenSlice.actions;
export const tokenReducer = tokenSlice.reducer;
