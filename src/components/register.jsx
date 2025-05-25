import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading menjadi true saat proses pendaftaran dimulai
    setMsg(""); // Reset pesan error

    if (password !== confPassword) {
      setIsLoading(false);
      setMsg("Password dan konfirmasi password tidak cocok");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/user/register`,
        {
          username: username,
          name: name,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setIsLoading(false); // Set loading menjadi false setelah respons diterima

      if (res.status === 201) {
        setMsg("Pendaftaran berhasil! Anda akan dialihkan ke halaman login.");
        setTimeout(() => {
          navigate("/"); // Redirect setelah beberapa detik
        }, 2000);
      } else {
        setMsg("Pendaftaran gagal: Terjadi kesalahan pada server.");
      }
    } catch (error) {
      setIsLoading(false); // Pastikan loading di-set false jika terjadi error
      if (error.response && error.response.data && error.response.data.message) {
        setMsg(error.response.data.message);
      } else {
        setMsg("Pendaftaran gagal: Kesalahan jaringan atau server.");
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form onSubmit={registerHandler} className="box">
                <p className="has-text-centered">{msg}</p>
                <div className="field mt-5">
                  <label className="label">Username</label>
                  <div className="controls">
                    <input
                      type="text"
                      className="input"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">Name</label>
                  <div className="controls">
                    <input
                      type="text"
                      className="input"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input
                      type="password"
                      className="input"
                      placeholder="******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">Confirm Password</label>
                  <div className="controls">
                    <input
                      type="password"
                      className="input"
                      placeholder="******"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <button
                    className={`button is-success is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Mendaftar...' : 'Register'}
                  </button>
                </div>
                <p className="has-text-centered">
                  <Link to="/">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;