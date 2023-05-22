import axios from "axios";

const API_URL = "http://localhost:9090/imagen";

export const getImageList = () => {
  return axios.get(API_URL);
};

export const createImage = (image) => {
  return axios.post(API_URL, image);
};

export const updateImage = (image) => {
  return axios.put(API_URL, image);
};

export const deleteImage = (id) => {
  const url = `${API_URL}/${id}`;
  return axios.delete(url);
};

export const deleteSelectedImages = (ids) => {
  const deleteRequests = ids.map((id) =>
    deleteCategory(id)
  );
  return Promise.all(deleteRequests);
};
