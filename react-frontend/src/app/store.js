import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import authSliceReducer from '../features/auth/authSlice';
import employeeSliceReducer from '../features/employee/employeeSlice';
import loanSliceReducer from '../features/loan/loanSlice';
import projectSliceReducer from '../features/project/projectSlice';
import administratorSliceReducer from '../features/administrator/administratorSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    employee: employeeSliceReducer,
    loan: loanSliceReducer,
    project: projectSliceReducer,
    administrator: administratorSliceReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware),
});

export default store;
