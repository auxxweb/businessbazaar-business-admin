import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  price: "",
  plan: "",
};

const planSlice = createSlice({
  name: 'planDetails',
  initialState,
  reducers: {
    setPlanDetails: (state, action) => {
      const { name, price, plan } = action.payload;
      state.name = name;
      state.price = price;
      state.plan = plan;
    },
    clearPlanDetails: (state) => {
      state.name = "";
      state.price = "";
      state.plan = "";
    },
  },
});

export const { setPlanDetails, clearPlanDetails } = planSlice.actions;

export default planSlice.reducer;
