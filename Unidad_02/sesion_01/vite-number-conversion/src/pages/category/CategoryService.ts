import axios from "axios";

const API_URL = "http://localhost:9090/categoria";

export const getCategory = async () => {
  return await axios.get(API_URL);
};
