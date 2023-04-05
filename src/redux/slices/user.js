import { createSlice } from '@reduxjs/toolkit';

const getSession = () => {
  const session = localStorage.getItem('session');
  let user;

  if (session) {
    try {
      user = JSON.parse(session);
    } catch (e) {
      user = undefined;
    }
  }

  return user;
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    session: getSession(),
    drawer: false,
  },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      localStorage.setItem('session', JSON.stringify(state.session));
    },
    setDrawer: (state, action) => {
      state.drawer = action.payload;
    },
  },
});

export const { setSession, setDrawer } = userSlice.actions;
export const selectSession = (state) => state.user.session;
export const selectDrawer = (state) => state.user.drawer;

export default userSlice.reducer;
