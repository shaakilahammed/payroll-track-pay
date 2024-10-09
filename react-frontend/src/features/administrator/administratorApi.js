import { apiSlice } from '../api/apiSlice';

export const administratorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdministrators: builder.query({
      query: () => `/users`,
      providesTags: ['Administrators'],
    }),
    getAdministrator: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, arg) => [
        {
          type: 'Administrator',
          id: arg,
        },
      ],
    }),
    addAdministrator: builder.mutation({
      query: (data) => ({
        url: `/users`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Administrators'],
    }),
    editAdministrator: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        'Administrators',
        { type: 'Administrator', id: arg.id },
      ],
    }),
    deleteAdministrator: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Administrators'],
    }),
  }),
});

export const {
  useGetAdministratorsQuery,
  useGetAdministratorQuery,
  useAddAdministratorMutation,
  useEditAdministratorMutation,
  useDeleteAdministratorMutation,
} = administratorApi;
