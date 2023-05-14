import { useState, useEffect } from "react";
import Category from "./Category";
import { searchCategories, removeCategory } from "./CategoryApi";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await searchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await removeCategory(id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.categoriaId !== id)
      );
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <h1>Category List</h1>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.categoriaId}>
              {category.categoriaName} - {category.categoriaDescription}
              <button
                onClick={() => deleteCategory(String(category.categoriaId))}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
