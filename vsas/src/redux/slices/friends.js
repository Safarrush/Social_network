import { createSlice } from "@reduxjs/toolkit";
import { initialData } from "../initialState";

export const friendsSlice = createSlice({
  name: "friends",
  initialState: initialData.friends,
  reducers: {
    //добавить заявку
    setApplication: (state, action) => {
      state.application.push(action.payload);
    },

    //удалить заявку
    deleteApplication: (state, action) => {
      state.application = state.application.filter(
        (el) => el.recepient !== action.payload
      );
    },
    //очистить список заявок
    clearApplication: (state) => {
      state.application = [];
    },

    setFriends: (state, action) => {
      return state.list.push(action.payload);
    },

    deleteFriends: (state, action) => {
      return state.list.filter((friend) => friend.id !== action.payload);
    },
  },
});
export const {
  setApplication,
  deleteApplication,
  setFriends,
  deleteFriends,
  clearApplication,
} = friendsSlice.actions;
export const friendsReducer = friendsSlice.reducer;
