import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  email: '',
  mobile: '',
  super_admin: false,
};

const administratorSlice = createSlice({
  name: 'administrator',
  initialState,
  reducers: {
    setAdministrator: (state, action) => {
      const { id, name, email, mobile, super_admin } = action.payload;
      state.id = id;
      state.name = name;
      state.email = email;
      state.mobile = mobile;
      state.super_admin = super_admin;
    },
    resetAdministrator: (state) => {
      state.id = '';
      state.name = '';
      state.email = '';
      state.mobile = '';
      state.super_admin = false;
    },
  },
});

export const {
  setAdministrator,
  resetAdministrator,
} = administratorSlice.actions;
export default administratorSlice.reducer;
