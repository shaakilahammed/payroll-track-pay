import { apiSlice } from '../api/apiSlice';
import { userLoggedIn, userLoggedOut } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          localStorage.setItem(
            'auth',
            JSON.stringify({
              accessToken: result.data.data.access_token,
              user: result.data.data.user,
            })
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.access_token,
              user: result.data.data.user,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),

      async onQueryStarted(arg, { dispatch }) {
        try {
          localStorage.removeItem('auth');

          dispatch(userLoggedOut());
        } catch (err) {
          // do nothing
        }
      },
    }),
    getProfile: builder.query({
      query: () => `/me`,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/me',
        method: 'PUT',
        body: data,
      }),
      // async onQueryFulfilled(result, arg, { dispatch, cache }) {
      //   const responseData = await result.data;
      //   console.log(responseData); // Now it should log the response data

      //   try {
      //     if (responseData.success) {
      //       await cache.invalidateTags(['Profile']);
      //     }
      //   } catch (err) {
      //     // Handle error if needed
      //   }
      // },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
