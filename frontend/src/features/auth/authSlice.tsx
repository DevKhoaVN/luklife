import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state value
const initialState = {
  token: localStorage.getItem("token") || null, // AccessToken
  isAuthenticated: !!localStorage.getItem("token"), // Kiểm tra nếu có token
  user: null, //Thông tin người dùnh
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action lưu trữ token và thông tin người dùng
    setAuthData: (state, action) => {
      const { token, user } = action.payload;
      state.token = token.access_token;
      state.user = user;
      state.isAuthenticated = true;

      // Lưu vào localStorage để duy trì trạng thái khi refresh trình duyệt
      localStorage.setItem("token", token);
    },

    // Action đăng xuất
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      // Xóa token khỏi localStorage
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
