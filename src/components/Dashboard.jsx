import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils"; // Adjust path if needed

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Or get from context, etc.
        const response = await axios.get(`${BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data.data);
      } catch (error) {
        setError(error.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return null;

  return (
    <div className="container">
      <h1 className="title">Dashboard</h1>

      {/* Display Summary */}
      {dashboardData.summary && (
        <div className="box">
          <h2 className="subtitle">Summary</h2>
          <p>Current Month: {dashboardData.summary.currentMonth}</p>
          <p>Current Year: {dashboardData.summary.currentYear}</p>
          <p>Total Income: {dashboardData.summary.totalIncome}</p>
          <p>Total Expense: {dashboardData.summary.totalExpense}</p>
          <p>Balance: {dashboardData.summary.balance}</p>
          {/* ... other summary data */}
        </div>
      )}

      {/* Display Recent Transactions */}
      {dashboardData.recentTransactions && (
        <div className="box">
          <h2 className="subtitle">Recent Transactions</h2>
          {dashboardData.recentTransactions.map((transaction) => (
            <div key={transaction.id}>
              {transaction.date} - {transaction.category.name} - {transaction.amount}
            </div>
          ))}
        </div>
      )}

      {/* Display Top Expense Categories */}
      {dashboardData.topExpenseCategories && (
        <div className="box">
          <h2 className="subtitle">Top Expense Categories</h2>
          {dashboardData.topExpenseCategories.map((category) => (
            <div key={category.categoryId}>
              {category.categoryName}: {category.totalAmount}
            </div>
          ))}
        </div>
      )}

      {/* Display Monthly Overview */}
      {dashboardData.monthlyOverview && (
        <div className="box">
          <h2 className="subtitle">Monthly Overview</h2>
          <p>Period: {dashboardData.monthlyOverview.period}</p>
          <p>Income Transactions: {dashboardData.monthlyOverview.incomeTransactionCount}</p>
          <p>Expense Transactions: {dashboardData.monthlyOverview.expenseTransactionCount}</p>
          {/* ... other monthly overview data */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;