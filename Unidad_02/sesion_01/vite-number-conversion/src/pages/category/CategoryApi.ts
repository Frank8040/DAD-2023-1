import axios from "axios";
import Category from "./Category";

const API_URL = "http://localhost:9090/";

export async function getCategory() {
  const url = `${API_URL}categoria`;
  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export const createCategory = async (category: Category): Promise<Category> => {
  try {
    const response = await axios.post(`${API_URL}categoria`, category);
    return response.data;
  } catch (error) {
    throw new Error("Error creating category");
  }
};

export const updateCategory = async (category: Category): Promise<Category> => {
  try {
    const response = await axios.post(`${API_URL}categoria`, category);
    return response.data;
  } catch (error) {
    throw new Error("Error updating category");
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}categoria/${id}`);
    console.log("Category deleted successfully");
  } catch (error) {
    throw new Error("Error deleting category");
  }
};
export async function searchCategoryById(id: string) {
  const url = `${API_URL}categoria/${id}`;
  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
