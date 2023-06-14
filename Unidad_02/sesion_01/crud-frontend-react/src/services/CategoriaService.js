import axios from "axios";

const API_URL = "http://localhost:9090/categoria";
// token
const token = localStorage.getItem("token");
// end token

export const getCategoryList = () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createCategory = (categoria) => {
  return axios.post(API_URL, categoria, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCategory = (categoria) => {
  return axios.put(API_URL, categoria, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCategory = (id) => {
  const url = `${API_URL}/${id}`;
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteSelectedCategories = (categoriaIds) => {
  const deleteRequests = categoriaIds.map((id) =>
    deleteCategory(id)
  );
  return Promise.all(deleteRequests, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
