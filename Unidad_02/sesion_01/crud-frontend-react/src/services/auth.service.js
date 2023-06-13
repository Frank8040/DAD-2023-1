import axios from "axios";

const API_URL = "http://localhost:9090/auth/";

export const login = (userName, password) => {
  return axios
    .post(API_URL + "login", {
      userName,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const register = (userName, password) => {
  return axios.post(API_URL + "create", {
    userName,
    password,
  });
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
