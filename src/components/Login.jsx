import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading menjadi true saat proses login dimulai
    setMsg(""); // Reset pesan error

    try {
      const res = await axios.post(
        `${BASE_URL}/user/login`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsLoading(false); // Set loading menjadi false setelah respons diterima

      if (res.status === 200 && res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        // Jika ada informasi pengguna lain, simpan juga
        // if (res.data.user) {
        //   localStorage.setItem("user", JSON.stringify(res.data.user));
        // }
        navigate("/dashboard");
      } else {
        setMsg("Login gagal: Respon tidak valid");
      }
    } catch (error) {
      setIsLoading(false); // Pastikan loading di-set false jika terjadi error
      if (error.response && error.response.data && error.response.data.message) {
        setMsg(error.response.data.message);
      } else {
        setMsg("Login gagal: Kesalahan jaringan atau server");
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form onSubmit={loginHandler} className="box">
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
                  <button
                    className={`button is-success is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Login'}
                  </button>
                </div>
                <p className="has-text-centered">
                  <Link to="/register">Register</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
