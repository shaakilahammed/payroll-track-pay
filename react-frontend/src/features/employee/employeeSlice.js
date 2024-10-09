import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  email: '',
  address: '',
  mobile: '',
  hourRate: '',
  active: false,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployee: (state, action) => {
      const {
        id,
        name,
        email,
        address,
        mobile,
        hourRate,
        active,
      } = action.payload;
      state.id = id;
      state.name = name;
      state.email = email;
      state.address = address;
      state.mobile = mobile;
      state.hourRate = hourRate;
      state.active = active;
    },
    resetEmployee: (state) => {
      state.id = '';
      state.name = '';
      state.email = '';
      state.address = '';
      state.mobile = '';
      state.hourRate = '';
      state.active = false;
    },
  },
});

export const { setEmployee, resetEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
