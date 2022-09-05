import axios from "axios";

const API_URL = "http://localhost:8181/api/user/";
const register = (username, email, password) => {
    return axios.post(API_URL, {
        username,
        email,
        password,
    });
};
const login = (username, password) => {
    return axios
        .post(API_URL + "authenticate", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
};
const logout = () => {
    localStorage.removeItem("user");
    /*return axios.post(API_URL + "signout").then((response) => {
        return response.data;
    });*/
};
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};
const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}
export default AuthService