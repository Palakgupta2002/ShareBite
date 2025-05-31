// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/authService";
import "../style/login.css"; // Assuming you have a CSS file for styling
import donationImage from "../assest/image.png"; // Update with your image path

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginService(email, password);
      // data = { _id, name, email, token }
      console.log("Login Successful:",data)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userId", data._id);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div>
      <header  className="home-header">
        <h1 onClick={()=>navigate("/")}>ShareBite</h1>
      </header>
      <div className="login-container">
        <div className="login-form">
          <h2>Welcome Back!</h2>
          <p>Sign in with your Username and Password.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p className="forgot-password">Forgot Password?</p>
          <div className="social-login">
            <p>or login with</p>
            <button className="google-login">Login with Google</button>
            <button className="facebook-login">Login with Facebook</button>
          </div>
        </div>
        <div className="login-image">
          <img src={donationImage} alt="Food" />
        </div>
      </div>
    </div>
  );
}
