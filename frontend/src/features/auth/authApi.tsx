// import { api } from "../../api/axios";
// import { authActions } from "./authSlice";
//
// export const authApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     // 1. Endpoint Đăng nhập
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       async onQueryStarted(args, { dispatch, queryFulfilled }) {
//         try {
//           const { data } = await queryFulfilled;
//           console.log(data);
//           // Lưu Access Token và user info khi login thành công
//           dispatch(authActions.setAuthData(data));
//         } catch (error) {
//           // Xử lý lỗi
//         }
//       },
//     }),
//
//     // 2. Endpoint Đăng ký
//     register: builder.mutation({
//       query: (userData) => ({
//         url: "/auth/register",
//         method: "POST",
//         body: userData,
//       }),
//       // Không cần onQueryStarted nếu bạn chỉ muốn chuyển hướng sang Login sau đó
//     }),
//
//     // 3. Endpoint Đăng xuất
//     logout: builder.mutation({
//       query: () => ({
//         url: "/auth/logout", // API yêu cầu server xóa Refresh Token Cookie
//         method: "POST",
//       }),
//       async onQueryStarted(args, { dispatch, queryFulfilled }) {
//         try {
//           // Chờ API logout hoàn tất
//           await queryFulfilled;
//         } catch (error) {
//           // Có thể API lỗi (ví dụ token đã hết hạn) nhưng ta vẫn phải clear client state
//           console.error(
//             "API Logout failed/expired, but clearing client state anyway:",
//             error
//           );
//         } finally {
//           // Xóa Access Token khỏi client state (rất quan trọng)
//           dispatch(authActions.logout());
//           // Reset cache của RTK Query
//           dispatch(api.util.resetApiState());
//         }
//       },
//     }),
//   }),
// });
//
// // Export các hooks sử dụng trong component
// export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
//   authApi;
