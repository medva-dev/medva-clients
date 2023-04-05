import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    refreshUnread: 0,
    show: false,
  },
  reducers: {
    setShow: (state, action) => {
      state.show = action.payload;
    },
    insertMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    initializeMessages: (state, action) => {
      state.messages = action.payload;
    },
    setRefreshUnread: (state) => {
      state.refreshUnread += 1;
    },
  },
});

export const { insertMessage, initializeMessages, setRefreshUnread, setShow } =
  slice.actions;

export const selectMessages = (state) => state.messages.messages;
export const selectRefreshUnread = (state) => state.messages.refreshUnread;
export const selectShow = (state) => state.messages.show;

export default slice.reducer;
