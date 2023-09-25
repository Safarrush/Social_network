import { configureStore } from "@reduxjs/toolkit";
import { getInitialData } from "./initialState";
import { tokenReducer } from "./slices/tokenSlice";
import { friendsReducer } from "./slices/friends";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    friends: friendsReducer,
  },
  preloadedState: getInitialData(),
});

store.subscribe(() => {
  localStorage.setItem("reduxStore", JSON.stringify(store.getState()));
});
// сохранение данных редакса в ls
