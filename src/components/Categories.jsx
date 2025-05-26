import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils"; // Adjust path

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/category`,
        { name: newCategory.name, type: newCategory.type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCategories();
      setNewCategory({ name: "", type: "income" });
      setSuccessMessage("Category added successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create category");
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setError(null);
      setSuccessMessage(null);
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/category/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCategories();
        setSuccessMessage("Category deleted successfully!");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete category");
      }
    }
  };

  if (loading) return <section className="section is-fullheight"><div className="container has-text-centered"><span className="icon is-large"><i className="fas fa-spinner fa-pulse fa-3x"></i></span><p>Loading categories...</p></div></section>;
  if (error) return <section className="section"><div className="container"><div className="notification is-danger">{error}</div></div></section>;

  return (
    <section className="section">
      <div className="container">
        <section className="hero is-primary is-small mb-4">
          <div className="hero-body">
            <h1 className="title">Categories</h1>
            <h2 className="subtitle">Manage your transaction categories</h2>
          </div>
        </section>

        {successMessage && (
          <div className="notification is-success mb-4">{successMessage}</div>
        )}

        <div className="columns">
          <div className="column is-half">
            <div className="card">
              <div className="card-header">
                <h3 className="card-header-title">Category List</h3>
              </div>
              <div
                className="card-content"
                style={{ maxHeight: '50vh', overflowY: 'auto' }}
              >
                <table className="table is-striped is-fullwidth">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>
                          <span className={`tag is-${category.type === 'income' ? 'success' : 'danger'} is-light`}>
                            {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button className="delete is-small" onClick={() => deleteCategory(category.id)}></button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr><td className="has-text-centered" colSpan="3">No categories yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="column is-half">
            <div className="card">
              <div className="card-header">
                <h3 className="card-header-title">Add New Category</h3>
              </div>
              <div className="card-content">
                <form onSubmit={createCategory}>
                  <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        name="name"
                        value={newCategory.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
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
                  <div className="field">
                    <div className="control">
                      <button type="submit" className="button is-primary is-fullwidth">
                        Add Category
                      </button>
                    </div>
                  </div>
                  {error && <p className="help is-danger">{error}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
