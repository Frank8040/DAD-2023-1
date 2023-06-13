import axios from "axios";

const API_URL = "http://localhost:9090/auth";

export const getAuthList = () => {
  return axios.get(API_URL);
};

export const createLogin = (loginUser) => {
  return axios.post(`${API_URL}/login`, loginUser);
};

export const createUser = (createUser) => {
  return axios.post(`${API_URL}/create`, createUser);
};

export const updateUser = (user) => {
  return axios.put(API_URL, user);
};

export const deleteUser = (id) => {
  const url = `${API_URL}/${id}`;
  return axios.delete(url);
};

export const deleteSelectedUsers = (userIds) => {
  const deleteRequests = userIds.map((id) => deleteUser(id));
  return Promise.all(deleteRequests);
};
