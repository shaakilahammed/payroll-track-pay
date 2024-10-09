import { apiSlice } from '../api/apiSlice';

export const salaryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalaryData: builder.mutation({
      query: (data) => ({
        url: `/salaries/get-data`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['SalaryData'],
    }),

    getSalaryDataByEmployeeId: builder.mutation({
      query: ({ id, data }) => ({
        url: `/salaries/get-data/${id}`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['SalaryDataByEmployeeId'],
    }),

    addSalary: builder.mutation({
      query: (data) => ({
        url: `/salaries`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'Employees',
        'SalaryData',
        'Loans',
        'PaymentHistoryList',
      ],
    }),

    getPaymentHistoryList: builder.query({
      query: () => `/salaries/references`,
      providesTags: ['PaymentHistoryList'],
    }),

    getPaymentHistoryByReference: builder.query({
      query: (reference) => `/salaries/references/${reference}`,
      providesTags: ['PaymentHistoryByReference'],
    }),

    getPaymentHistoryByReferenceEmployeeId: builder.query({
      query: ({ reference, employeeId }) =>
        `/salaries/references/${reference}/${employeeId}`,
      providesTags: ['PaymentHistoryByReferenceEmployeeId'],
    }),

    getSalaryReport: builder.mutation({
      query: (data) => ({
        url: `/salaries/report`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['SalaryReport'],
    }),
  }),
});

export const {
  useGetSalaryDataMutation,
  useAddSalaryMutation,
  useGetSalaryDataByEmployeeIdMutation,
  useGetPaymentHistoryListQuery,
  useGetPaymentHistoryByReferenceQuery,
  useGetPaymentHistoryByReferenceEmployeeIdQuery,
  useGetSalaryReportMutation,
} = salaryApi;
