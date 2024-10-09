import { apiSlice } from '../api/apiSlice';

export const loanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoans: builder.query({
      query: ({ month, year }) => `/loans?month=${month}&year=${year}`,
      providesTags: ['Loans'],
    }),
    getLoan: builder.query({
      query: (id) => `/loans/${id}`,
      providesTags: (result, error, arg) => [
        {
          type: 'Loan',
          id: arg,
        },
      ],
    }),
    addLoan: builder.mutation({
      query: (data) => ({
        url: `/loans`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Loans', 'Employees'],
    }),
    editLoan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/loans/${id}`,
        method: 'PATCH',
        body: data,
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const result = await queryFulfilled;
      //     //   console.log(result.data.data);
      //     dispatch(
      //       setLoan({
      //         employee_id: result.data.data.employee_id,
      //         amount: result.data.data.amount,
      //       })
      //     );
      //   } catch (err) {
      //     // do nothing
      //   }
      // },
      invalidatesTags: (result, error, arg) => [
        'Loans',
        { type: 'Loan', id: arg.id },
        'Employees',
      ],
    }),
    deleteLoan: builder.mutation({
      query: (id) => ({
        url: `/loans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Loans', 'Employees'],
    }),
  }),
});

export const {
  useGetLoansQuery,
  useAddLoanMutation,
  useGetLoanQuery,
  useDeleteLoanMutation,
  useEditLoanMutation,
} = loanApi;
