import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  employee_id: '',
  date: '',
  amount: '',
};

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setLoan: (state, action) => {
      const { id, employee_id, date, amount } = action.payload;
      state.id = id;
      state.employee_id = employee_id;
      state.date = date;
      state.amount = amount;
    },
    resetLoan: (state) => {
      state.id = '';
      state.employee_id = '';
      state.amount = '';
      state.date = '';
    },
  },
});

export const { setLoan, resetLoan } = loanSlice.actions;
export default loanSlice.reducer;
