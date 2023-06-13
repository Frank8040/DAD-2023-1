import axios from "axios";

const API_URL = "http://localhost:9090/producto";

export const getProductList = () => {
  return axios.get(API_URL);
};

export const createProduct = (product) => {
  return axios.post(API_URL, product);
};

export const updateProduct = (id, product) => {
  return axios.put(`${API_URL}/imagen/${id}`, product);
};

export const deleteProduct = (id) => {
  const url = `${API_URL}/${id}`;
  return axios.delete(url);
};

export const deleteSelectedProducts = (productIds) => {
  const deleteRequests = productIds.map((id) => deleteProduct(id));
  return Promise.all(deleteRequests);
};
