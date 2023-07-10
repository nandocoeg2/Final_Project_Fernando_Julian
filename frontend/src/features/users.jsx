import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.REACT_APP_API_URL;

export const userApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/token",
        method: "GET",
        credentials: "include",
      }),
    }),
    menu: builder.mutation({
      query: () => ({
        url: "/menu",
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: userData,
        credentials: "include",
      }),
    }),
    getReportData: builder.query({
      query: () => ({
        url: "/report",
        method: "GET",
        credentials: "include",
      }),
    }),
    getReportDataByUserId: builder.mutation({
      query: (id) => ({
        url: `/report/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getReportDataByDataId: builder.query({
      query: (id) => ({
        url: `/detail/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    addReportData: builder.mutation({
      query: (reportData) => ({
        url: "/report",
        method: "POST",
        body: reportData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useMenuMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetReportDataQuery,
  useGetReportDataByUserIdMutation,
  useGetReportDataByDataIdQuery,
  useAddReportDataMutation,
} = userApi;
