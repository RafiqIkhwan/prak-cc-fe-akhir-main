import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils"; // Adjust path

const EditUser = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Or get from context
        const response = await axios.get(`${BASE_URL}/dashboard`, { // Or a specific user endpoint
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming the dashboard response includes user data
        setName(response.data.data.summary.name || ""); // Adjust based on your API response
      } catch (error) {
        setError(error.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    try {
      setMsg(""); // Clear previous message
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/user`,
        { name: name, password: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Profile updated successfully!");
      setTimeout(() => {
        navigate("/dashboard"); // Redirect after a short delay
      }, 1500);
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return (
    <section className="section is-fullheight">
      <div className="container has-text-centered">
        <span className="icon is-large">
          <i className="fas fa-spinner fa-pulse fa-3x"></i>
        </span>
        <p>Loading profile data...</p>
      </div>
    </section>
  );

  if (error) return (
    <section className="section">
      <div className="container">
        <div className="notification is-danger">{error}</div>
      </div>
    </section>
  );

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            {/* Arrow Back Button */}
            <button
              className="button is-text mb-4"
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span className="icon">
                <i className="fas fa-arrow-left"></i>
              </span>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="title is-2 has-text-centered">Edit Profile</h1>
            <form onSubmit={updateProfile} className="box">
              {msg && (
                <p className={`notification ${msg.includes('success') ? 'is-success' : 'is-danger'} is-light has-text-centered`}>
                  {msg}
                </p>
              )}
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">New Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password (optional)"
                  />
                </div>
                <p className="help">Leave blank to keep the current password.</p>
              </div>
              <div className="field">
                <label className="label">Confirm New Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-primary is-fullwidth" type="submit">
                    Update Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditUser;
