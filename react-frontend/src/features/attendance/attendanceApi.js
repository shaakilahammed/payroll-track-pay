import { apiSlice } from '../api/apiSlice';

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.mutation({
      query: (date) => ({
        url: '/attendances/show',
        method: 'POST',
        body: { date },
      }),
    }),
    addAttendance: builder.mutation({
      query: (data) => ({
        url: '/attendances',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'StatsToday',
        'PresentEmployeeData',
        'WorkingEmployees',
        'MailToday'
      ],
    }),

    getAttendanceReportByEmployeeId: builder.mutation({
      query: (data) => ({
        url: '/attendances/report',
        method: 'POST',
        body: data,
      }),
    }),
    getAttendanceReportOverall: builder.mutation({
      query: (data) => ({
        url: '/attendances/overall-report',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAttendanceMutation,
  useAddAttendanceMutation,
  useGetAttendanceReportByEmployeeIdMutation,
  useGetAttendanceReportOverallMutation,
} = attendanceApi;
