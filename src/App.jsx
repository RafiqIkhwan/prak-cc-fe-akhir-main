import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/register";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transaction";
import Categories from "./components/Categories"; // And this
import EditUser from "./components/EditUser"; // And this
import Navbar from "./components/Navbar"; // And this

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/transactions"
          element={
            <>
              <Navbar />
              <Transactions />
            </>
          }
        />
        <Route
          path="/categories"
          element={
            <>
              <Navbar />
              <Categories />
            </>
          }
        />
        <Route path="/edit-profile" element={<EditUser />} />
        {/* <Route path="/edit/:id" element={<EditUser />} />  // Assuming this is for editing other users, not profile */}
        <Route path="/" element={<Login />} /> {/* Redirect to login as default */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;