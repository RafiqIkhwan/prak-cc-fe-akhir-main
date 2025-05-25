import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils"; // Adjust path

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    note: "",
    date: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]); // For dropdown

  // Dipindah ke luar agar bisa dipanggil ulang
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
    setError(null); // Reset error sebelum submit
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
      await fetchTransactions(); // Tunggu fetch selesai
      setNewTransaction({ amount: "", note: "", date: "", categoryId: "" });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create transaction"
      );
    }
  };

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="title">Transactions</h1>

      {/* Transaction List */}
      <div className="box">
        {transactions.map((transaction) => (
          <div key={transaction.id || `${transaction.date}-${transaction.note}`}>
            {transaction.date} - {transaction.category?.name} - {transaction.amount} - {transaction.note}
          </div>
        ))}
      </div>

      {/* Create Transaction Form */}
      <div className="box">
        <h2 className="subtitle">Add Transaction</h2>
        <form onSubmit={createTransaction}>
          <div className="field">
            <label className="label">Amount</label>
            <input
              type="number"
              className="input"
              name="amount"
              value={newTransaction.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="field">
            <label className="label">Note</label>
            <input
              type="text"
              className="input"
              name="note"
              value={newTransaction.note}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              name="date"
              value={newTransaction.date}
              onChange={handleInputChange}
              required
            />
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
          <button type="submit" className="button is-primary">
            Add
          </button>
          {error && <p className="help is-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Transactions;