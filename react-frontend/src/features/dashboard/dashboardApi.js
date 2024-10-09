import { apiSlice } from '../api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStatsToday: builder.query({
      query: () => '/stats/today',
      providesTags: ['StatsToday'],
    }),
    sendMailToday: builder.query({
      query: () => '/send-mail',
      providesTags: ['MailToday'],
    }),
    getPresentEmployeeData: builder.query({
      query: () => '/stats/present-employee-data',
      providesTags: ['PresentEmployeeData'],
    }),
    getWorkingEmployeesData: builder.query({
      query: () => '/stats/working-employees',
      providesTags: ['WorkingEmployees'],
    }),
    getRunningProjectsData: builder.query({
      query: () => '/stats/running-projects',
      providesTags: ['RunningProjects'],
    }),
  }),
});

export const {
  useGetStatsTodayQuery,
  useGetPresentEmployeeDataQuery,
  useGetWorkingEmployeesDataQuery,
  useGetRunningProjectsDataQuery,
  useLazySendMailTodayQuery,
} = dashboardApi;
