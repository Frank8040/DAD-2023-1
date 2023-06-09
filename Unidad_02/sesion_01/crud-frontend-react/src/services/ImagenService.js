import axios from "axios";

const API_URL = "http://localhost:9090/imagen";

export const getImageList = () => {
  return axios.get(API_URL);
};

export const getImage = (imageId) => {
  return axios.get(`${API_URL}/${imageId}`); // Reemplaza la URL de la API con la correcta
};

export const createImage = (image) => {
  return axios.post(API_URL, image);
};

export const updateImage = (id, image) => {
  return axios.put(`http://localhost:9090/imagen/imagen/${id}`, image);
};

export const deleteImage = (id) => {
  const url = `${API_URL}/${id}`;
  return axios.delete(url);
};

export const deleteSelectedImages = (ids) => {
  const deleteRequests = ids.map((id) => deleteImage(id));
  return Promise.all(deleteRequests);
};
