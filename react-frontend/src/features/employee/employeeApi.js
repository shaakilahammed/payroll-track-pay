import { apiSlice } from '../api/apiSlice';
import { setEmployee } from './employeeSlice';

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => '/employees',
      providesTags: ['Employees'],
    }),
    getActiveEmployees: builder.query({
      query: () => '/employees/active',
      providesTags: ['ActiveEmployees'],
    }),
    getEmployee: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, arg) => [
        {
          type: 'Employee',
          id: arg,
        },
      ],
    }),
    addEmployee: builder.mutation({
      query: (data) => ({
        url: `/employees`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employees'],
    }),
    toggleActiveEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Employees',
        'ActiveEmployees',
        'Loans',
        'StatsToday',
        'MailToday',
        'WorkingEmployees',
        'PresentEmployeeData',
      ],
    }),
    editEmployee: builder.mutation({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          //   console.log(result.data.data);
          dispatch(
            setEmployee({
              name: result.data.data.name,
              email: result.data.data.email,
              mobile: result.data.data.mobile,
              address: result.data.data.address,
              hourRate: result.data.data.hour_rate,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
      invalidatesTags: (result, error, arg) => [
        'Employees',
        { type: 'Employee', id: arg.id },
      ],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetActiveEmployeesQuery,
  useGetEmployeeQuery,
  useAddEmployeeMutation,
  useEditEmployeeMutation,
  useDeleteEmployeeMutation,
  useToggleActiveEmployeeMutation,
} = employeeApi;
