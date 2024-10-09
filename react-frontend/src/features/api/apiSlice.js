import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://attendence.crshop.net/api'
        : 'http://127.0.0.1:8000/api',
    // "https://attendence.crshop.net/api",
    // baseUrl: process.env.NODE_ENV === 'https://fijisalary.com/api',
    prepareHeaders: async (headers, { getState }) => {
      const token = getState()?.auth?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    'StatsToday',
    'MailToday',
    'PresentEmployeeData',
    'WorkingEmployees',
    'RunningProjects',
    'Profile',
    'Employees',
    'ActiveEmployees',
    'Employee',
    'Loans',
    'Loan',
    'SalaryData',
    'SalaryDataByEmployeeId',
    'PaymentHistoryList',
    'PaymentHistoryByReferenceEmployeeId',
    'PaymentHistoryByReference',
    'SalaryReport',
    'Projects',
    'Project',
    'Administrators',
    'Administrator',
  ],
  endpoints: () => ({}),
});
