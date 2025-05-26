import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navbarButtonStyle = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    zIndex: 1001,
  };

  const sidebarStyle = {
    position: "fixed",
    top: 0,
    right: isOpen ? 0 : "-220px",
    width: "220px",
    height: "100vh",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.05)",
    transition: "right 0.3s cubic-bezier(.4,2,.6,1)",
    zIndex: 1000,
    paddingTop: "3.5rem",
    backgroundColor: "#f5f5f5",
  };

  const menuLabelStyle = {
    paddingLeft: "1.5rem",
    color: "#363636",
  };

  const menuListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const logoutButtonContainerStyle = {
    position: "absolute",
    bottom: "2rem",
    width: "100%",
    textAlign: "center",
    padding: "0 1.5rem",
  };

  const logoutButtonStyle = {
    width: "100%",
    backgroundColor: "#f44336", // merah
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.2)",
    zIndex: 999,
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        className="button is-light"
        style={navbarButtonStyle}
        onClick={toggleSidebar}
        aria-label="Toggle Navigation"
      >
        <span className="icon">
          <i className="fas fa-bars"></i>
        </span>
      </button>

      {/* Sidebar */}
      <aside
        className={`menu has-background-light`}
        style={sidebarStyle}
      >
        <p className="menu-label" style={menuLabelStyle}>
          Menu
        </p>
        <ul className="menu-list" style={menuListStyle}>
          <li>
            <Link to="/dashboard" className="navbar-menu-item" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/edit-profile" className="navbar-menu-item" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/transactions" className="navbar-menu-item" onClick={() => setIsOpen(false)}>
              Transaksi
            </Link>
          </li>
          <li>
            <Link to="/categories" className="navbar-menu-item" onClick={() => setIsOpen(false)}>
              Category
            </Link>
          </li>
        </ul>
        <div style={logoutButtonContainerStyle}>
          <button
            onClick={handleLogout}
            className="button is-light is-fullwidth"
            type="button"
            style={logoutButtonStyle}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div style={overlayStyle} onClick={toggleSidebar} />
      )}

      {/* Animasi CSS untuk menu item */}
      <style>
        {`
          .navbar-menu-item {
            display: block;
            padding: 0.75rem 1.5rem;
            color: #363636;
            text-decoration: none;
            transition: background-color 0.3s ease, transform 0.2s ease;
            border-radius: 4px;
          }
          .navbar-menu-item:hover {
            background-color: #e0e0e0;
            transform: translateX(5px);
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
