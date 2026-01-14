import apiClient from "./axios"

//login function
export const login = async ({email , password }) => {

    const response = await apiClient.post(`/auth/login` ,  {
        email, password
    } )

    const { access_token } = response.data.token;

    if (access_token) {
        localStorage.setItem('access_token', access_token);
    }
    return response.data;
    
}

//Register function
export const register = async ({full_name , phone, gender, email, date_of_birth,  password }) => {

    const response = await apiClient.post(`/auth/register` , {
        full_name , phone, gender, email, date_of_birth,  password 
    }
    )

     const { access_token } = response.data.token;

    if (access_token) {
        localStorage.setItem('access_token', access_token);
    }
    return response.data
}

//Logout function
export const logout = async () => {
    const reponse = await apiClient.post(`/auth/logout`)
    return response.data
}