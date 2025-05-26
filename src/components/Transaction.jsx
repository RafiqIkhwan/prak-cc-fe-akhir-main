import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils"; // Adjust path

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    note: "",
    date: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]); // For dropdown
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    note: "",
    date: "",
    categoryId: "",
  });

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/transaction`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data.data);
    } catch (error) {
      setError(error.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.data);
      } catch (error) {
        setError(error.message || "Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const createTransaction = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/transaction/${newTransaction.categoryId}`,
        {
          amount: parseFloat(newTransaction.amount),
          note: newTransaction.note,
          date: newTransaction.date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchTransactions();
      setNewTransaction({ amount: "", note: "", date: "", categoryId: "" });
      setSuccessMessage("Transaction added successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create transaction"
      );
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransactionId(transaction.id);
    setEditFormData({
      amount: String(transaction.amount),
      note: transaction.note || "",
      date: transaction.date ? transaction.date.substring(0, 10) : "",
      categoryId: String(transaction.categoryId),
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setEditingTransactionId(null);
    setEditFormData({ amount: "", note: "", date: "", categoryId: "" });
  };

  const saveEditHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/transaction/${editingTransactionId}`,
        {
          amount: parseFloat(editFormData.amount),
          note: editFormData.note,
          date: editFormData.date,
          categoryId: editFormData.categoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchTransactions();
      setEditingTransactionId(null);
      setEditFormData({ amount: "", note: "", date: "", categoryId: "" });
      setSuccessMessage("Transaction updated successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update transaction"
      );
    }
  };

  const deleteTransactionHandler = async (id) => {
    setError(null);
    setSuccessMessage(null);
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/transaction/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchTransactions();
        setSuccessMessage("Transaction deleted successfully!");
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete transaction"
        );
      }
    }
  };

  if (loading) return <section className="section is-fullheight"><div className="container has-text-centered"><span className="icon is-large"><i className="fas fa-spinner fa-pulse fa-3x"></i></span><p>Loading transactions...</p></div></section>;
  if (error) return <section className="section"><div className="container"><div className="notification is-danger">{error}</div></div></section>;

  return (
    <section className="section">
      <div className="container">
        <section className="hero is-primary is-small mb-4">
          <div className="hero-body">
            <h1 className="title">Transactions</h1>
            <h2 className="subtitle">Manage your financial transactions</h2>
          </div>
        </section>

        {successMessage && (
          <div className="notification is-success mb-4">{successMessage}</div>
        )}

        <div className="columns">
          <div className="column is-two-thirds">
            <div className="card">
              <div className="card-header">
                <h3 className="card-header-title">Transaction List</h3>
              </div>
              <div
                className="card-content"
                style={{
                  overflowY: transactions.length > 6 ? 'auto' : 'hidden',
                  maxHeight: transactions.length > 6 ? '400px' : 'auto',
                }}
              >
                {transactions.length === 0 ? (
                  <p className="has-text-grey-light">No transactions yet.</p>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id || `${transaction.date}-${transaction.note}`}
                      className="columns is-vcentered is-mobile mb-2"
                      style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}
                    >
                      {editingTransactionId === transaction.id ? (
                        <div className="column is-12">
                          <form onSubmit={saveEditHandler}>
                            <div className="field is-horizontal">
                              <div className="field-label is-normal">
                                <label className="label">Amount</label>
                              </div>
                              <div className="field-body">
                                <div className="field">
                                  <div className="control">
                                    <input
                                      type="number"
                                      className="input"
                                      name="amount"
                                      value={editFormData.amount}
                                      onChange={handleEditInputChange}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="field is-horizontal">
                              <div className="field-label is-normal">
                                <label className="label">Note</label>
                              </div>
                              <div className="field-body">
                                <div className="field">
                                  <div className="control">
                                    <input
                                      type="text"
                                      className="input"
                                      name="note"
                                      value={editFormData.note}
                                      onChange={handleEditInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="field is-horizontal">
                              <div className="field-label is-normal">
                                <label className="label">Date</label>
                              </div>
                              <div className="field-body">
                                <div className="field">
                                  <div className="control">
                                    <input
                                      type="date"
                                      className="input"
                                      name="date"
                                      value={editFormData.date}
                                      onChange={handleEditInputChange}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="field is-horizontal">
                              <div className="field-label is-normal">
                                <label className="label">Category</label>
                              </div>
                              <div className="field-body">
                                <div className="field">
                                  <div className="control">
                                    <div className="select is-fullwidth">
                                      <select
                                        name="categoryId"
                                        value={editFormData.categoryId}
                                        onChange={handleEditInputChange}
                                        required
                                      >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                          <option key={category.id} value={category.id}>
                                            {category.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="field is-grouped">
                              <div className="control">
                                <button type="submit" className="button is-success">
                                  Save
                                </button>
                              </div>
                              <div className="control">
                                <button
                                  type="button"
                                  className="button is-warning"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                            {error && <p className="help is-danger">{error}</p>}
                          </form>
                        </div>
                      ) : (
                        <>
                          <div className="column">
                            <strong className="mr-2">{transaction.date}</strong>
                            <span className="tag is-info is-light mr-2">{transaction.category?.name}</span>
                            <span>Rp {parseFloat(transaction.amount).toLocaleString()}</span>
                            {transaction.note && <span className="has-text-grey ml-2">({transaction.note})</span>}
                          </div>
                          <div className="column is-narrow">
                            <div className="buttons is-right">
                              <button
                                className="button is-small is-info"
                                onClick={() => handleEditClick(transaction)}
                              >
                                <span className="icon is-small">
                                  <i className="fas fa-edit"></i>
                                </span>
                                <span>Edit</span>
                              </button>
                              <button
                                className="button is-small is-danger"
                                onClick={() => deleteTransactionHandler(transaction.id)}
                              >
                                <span className="icon is-small">
                                  <i className="fas fa-trash"></i>
                                </span>
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="column is-one-third">
            <div className="card">
              <div className="card-header">
                <h3 className="card-header-title">Add Transaction</h3>
              </div>
              <div className="card-content">
                <form onSubmit={createTransaction}>
                  <div className="field">
                    <label className="label">Amount</label>
                    <div className="control">
                      <input
                        type="number"
                        className="input"
                        name="amount"
                        value={newTransaction.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Note</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        name="note"
                        value={newTransaction.note}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Date</label>
                    <div className="control">
                      <input
                        type="date"
                        className="input"
                        name="date"
                        value={newTransaction.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Category</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          name="categoryId"
                          value={newTransaction.categoryId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button type="submit" className="button is-primary is-fullwidth">
                        Add Transaction
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

export default Transactions;
