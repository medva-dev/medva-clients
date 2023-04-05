import { createSlice } from '@reduxjs/toolkit';

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoiceId: 0,
    refresh: 0,
  },
  reducers: {
    setInvoiceId: (state, action) => {
      state.invoiceId = action.payload;
    },
    setRefresh: (state) => {
      state.refresh++;
    },
  },
});

export const { setInvoiceId, setRefresh } = invoicesSlice.actions;

export const selectInvoiceId = (state) => state.invoices.invoiceId;
export const selectRefresh = (state) => state.invoices.refresh;

export default invoicesSlice.reducer;
