import { configureStore } from '@reduxjs/toolkit';
import user from './slices/user';
import selections from './slices/selections';
import invoices from './slices/invoices';
import messages from './slices/messages';

const store = configureStore({
  reducer: {
    user,
    selections,
    invoices,
    messages,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
