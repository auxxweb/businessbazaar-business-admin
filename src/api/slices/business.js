import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {}, 
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessData: (state, action) => {
      state.data = action.payload;
    },
    clearBusinessData: (state) => {
      state.data = null;
    },
  },
});

export const { setBusinessData, clearBusinessData } = businessSlice.actions;

export default businessSlice.reducer;
