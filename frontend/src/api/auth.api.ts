import apiClient from "./axios"

//login function
export const login = async ({email , password }) => {

    const response = await apiClient.post(`/auth/login` ,  {
        email, password
    } )

    const { access_token } = response.data.token;

    if (access_token) {
        localStorage.setItem('token', access_token);
    }
    return response.data;
    
}

//Register function
export const register = async (data) => {

    console.log("ham registr")
    const response = await apiClient.post(`/auth/register` , {
        full_name: data.name , phone: data.sdt,  email: data.email,  password: data.password, password_confirmation: data.confirmPassword
    }
    )

     const { access_token } = response.data.token;

    if (access_token) {
        localStorage.setItem('token', access_token);
    }
    return response.data
}

//Logout function
export const logout = async () => {
  try {
    // Gọi backend để xóa refresh cookie (HttpOnly)
    await apiClient.post("/logout");
  } catch (error) {
    // Dù backend lỗi vẫn tiếp tục logout local
    console.warn("Logout API failed", error);
  } finally {
    // Xóa access token
    localStorage.removeItem("token");

    //Xóa user local
    localStorage.removeItem("user");

    // xóa Authorization header đang cache
    delete apiClient.defaults.headers.common["Authorization"];
  }

  return true;
};
