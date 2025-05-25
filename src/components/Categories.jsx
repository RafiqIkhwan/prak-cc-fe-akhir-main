import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils"; // Adjust path

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", type: "income" });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); // Or get from context
      const response = await axios.get(`${BASE_URL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.data);
    } catch (error) {
      setError(error.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/category`,
        { name: newCategory.name, type: newCategory.type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh categories
      fetchCategories();
      // Clear form
      setNewCategory({ name: "", type: "income" });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create category");
    }
  };

  const deleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh categories
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="title">Categories</h1>

      {/* Category List */}
      <div className="box">
        {categories.map((category) => (
          <div key={category.id}>
            {category.name} ({category.type})
            <button className="delete is-small" onClick={() => deleteCategory(category.id)}></button>
          </div>
        ))}
      </div>

      {/* Create Category Form */}
      <div className="box">
        <h2 className="subtitle">Add Category</h2>
        <form onSubmit={createCategory}>
          <div className="field">
            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="field">
            <label className="label">Type</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  name="type"
                  value={newCategory.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className="button is-primary">
            Add
          </button>
          {error && <p className="help is-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Categories;