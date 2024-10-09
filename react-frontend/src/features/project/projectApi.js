import { apiSlice } from '../api/apiSlice';

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => `/projects`,
      providesTags: ['Projects'],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, arg) => [
        {
          type: 'Project',
          id: arg,
        },
      ],
    }),
    addProject: builder.mutation({
      query: (data) => ({
        url: `/projects`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Projects', 'RunningProjects', 'MailToday'],
    }),
    editProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        'Projects',
        { type: 'Project', id: arg.id },
        'RunningProjects',
        'MailToday',
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects', 'RunningProjects'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useAddProjectMutation,
  useGetProjectQuery,
  useEditProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
