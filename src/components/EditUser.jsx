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
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/user`,
        { name: name, password: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Profile updated successfully");
      navigate("/dashboard"); // Redirect after update
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div>Loading profile data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="title">Edit Profile</h1>
      <form onSubmit={updateProfile} className="box">
        <p className="has-text-centered">{msg}</p>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirm New Password</label>
          <div className="control">
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Update Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;