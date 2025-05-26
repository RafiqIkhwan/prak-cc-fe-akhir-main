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
        const token = localStorage.getItem("token"); // Atau dapatkan dari context, dll.
        const response = await axios.get(`${BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data.data);
      } catch (error) {
        setError(error.message || "Gagal mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: '15px auto',
    padding: '15px',
    backgroundColor: '#f4f4f4',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto',
  };

  const titleStyle = {
    color: '#333',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '1.8em',
    opacity: 0,
    transform: 'translateY(-10px)',
    animation: 'fadeInTitle 0.8s ease-out forwards',
  };

  const rowStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  };

  const boxStyle = {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    borderLeft: '6px solid #5cb85c',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    flex: '1',
    minWidth: '200px',
  };

  const boxHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
  };

  const subtitleStyle = {
    color: '#337ab7',
    fontSize: '1.3em',
    marginTop: 0,
    marginBottom: '8px',
    borderBottom: '2px solid #eee',
    paddingBottom: '3px',
  };

  const paragraphStyle = {
    color: '#555',
    marginBottom: '6px',
    fontSize: '0.9em',
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginTop: '10px',
    color: '#777',
  };

  const errorStyle = {
    ...loadingStyle,
    color: '#d9534f',
    backgroundColor: '#fdecea',
    borderColor: '#e74c3c',
  };

  const transactionItemStyle = (index) => ({
    opacity: 0,
    transform: 'translateX(-5px)',
    animation: `slideIn 0.4s ease-out ${index * 0.08}s forwards`,
    fontSize: '0.85em',
    padding: '3px 0',
  });

  const animationStyles = `
    @keyframes fadeInTitle {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-5px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 600px) {
      .row {
        flex-direction: column;
      }
    }
  `;

  if (loading) return <div style={loadingStyle}>Memuat data dashboard...</div>;
  if (error) return <div style={errorStyle}>Error: {error}</div>;
  if (!dashboardData) return null;

  return (
    <div style={containerStyle}>
      <style>{animationStyles}</style>
      <h1 style={titleStyle}>Dasbor</h1>

      <div style={rowStyle}>
        {/* Tampilkan Ringkasan */}
        {dashboardData.summary && (
          <div
            style={boxStyle}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, boxHoverStyle)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, boxStyle)}
          >
            <h2 style={subtitleStyle}>Ringkasan</h2>
            <p style={paragraphStyle}>Bulan Ini: {dashboardData.summary.currentMonth}</p>
            <p style={paragraphStyle}>Tahun Ini: {dashboardData.summary.currentYear}</p>
            <p style={paragraphStyle}>Total Pemasukan: {dashboardData.summary.totalIncome}</p>
            <p style={paragraphStyle}>Total Pengeluaran: {dashboardData.summary.totalExpense}</p>
            <p style={paragraphStyle}>Saldo: {dashboardData.summary.balance}</p>
            {/* ... data ringkasan lainnya */}
          </div>
        )}

        {/* Tampilkan Transaksi Terakhir */}
        {dashboardData.recentTransactions && (
          <div
            style={boxStyle}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, boxHoverStyle)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, boxStyle)}
          >
            <h2 style={subtitleStyle}>Transaksi Terakhir</h2>
            {dashboardData.recentTransactions.map((transaction, index) => (
              <div key={transaction.id} style={transactionItemStyle(index)}>
                {new Date(transaction.date).toLocaleDateString()} - {transaction.category ? transaction.category.name : "-"} - {transaction.amount}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tampilkan Kategori Pengeluaran Teratas */}
      {dashboardData.topExpenseCategories && (
        <div
          style={{ ...boxStyle, marginBottom: '15px' }}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, boxHoverStyle)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, boxStyle)}
        >
          <h2 style={subtitleStyle}>Kategori Pengeluaran Teratas</h2>
          {dashboardData.topExpenseCategories.map((category) => (
            <div key={category.categoryId} style={paragraphStyle}>
              {category.categoryName}: {category.totalAmount}
            </div>
          ))}
        </div>
      )}

      {/* Tampilkan Ringkasan Bulanan */}
      {dashboardData.monthlyOverview && (
        <div
          style={boxStyle}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, boxHoverStyle)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, boxStyle)}
        >
          <h2 style={subtitleStyle}>Ringkasan Bulanan</h2>
          <p style={paragraphStyle}>Periode: {dashboardData.monthlyOverview.period}</p>
          <p style={paragraphStyle}>Jumlah Transaksi Pemasukan: {dashboardData.monthlyOverview.incomeTransactionCount}</p>
          <p style={paragraphStyle}>Jumlah Transaksi Pengeluaran: {dashboardData.monthlyOverview.expenseTransactionCount}</p>
          {/* ... data ringkasan bulanan lainnya */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
