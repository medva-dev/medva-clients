import { createSlice } from '@reduxjs/toolkit';

const getLastBookAttempt = () => {
  let book;

  try {
    book = JSON.parse(localStorage.getItem('book'));
  } catch (e) {
    book = undefined;
  }

  return book;
};

const getLastSubCategory = () => {
  let subCategory = {};

  try {
    subCategory = JSON.parse(localStorage.getItem('subCategory')) ?? {};
  } catch (e) {
    subCategory = {};
  }

  return subCategory;
};

const getLastCategory = () => {
  let category;

  try {
    category = localStorage.getItem('category') ?? undefined;
    if (category === 'undefined') {
      category = undefined;
    }
  } catch (e) {
    category = undefined;
  }

  return category;
};

export const selectionSlice = createSlice({
  name: 'selections',
  initialState: {
    category: getLastCategory(),
    subCategory: getLastSubCategory(),
    bookModal: getLastBookAttempt(),
    refresh: 0,
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      localStorage.setItem('category', action.payload);
    },
    setSubCategory: (state, action) => {
      const { subCategory, selected } = action.payload;

      state.subCategory[subCategory] = selected === true;
      localStorage.setItem('subCategory', JSON.stringify(state.subCategory));
    },
    setBookModal: (state, action) => {
      state.bookModal = action.payload;
      localStorage.setItem('book', JSON.stringify(action.payload));
    },
    setRefresh: (state) => {
      state.refresh += 1;
    },
  },
});

export const { setCategory, setSubCategory, setBookModal, setRefresh } =
  selectionSlice.actions;

export const selectCategory = (state) => state.selections.category;
export const selectSubCategory = (state) => state.selections.subCategory;
export const selectBookModal = (state) => state.selections.bookModal;
export const selectRefresh = (state) => state.selections.refresh;

export default selectionSlice.reducer;
