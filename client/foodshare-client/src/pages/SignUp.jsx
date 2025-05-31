// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp as signUpService } from "../services/authService";
import "../style/signUp.css";
import donationImage from "../assest/image.png";


export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await signUpService(name, email, password);
      // data = { _id, name, email, token }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div>
         <header  className="home-header">
        <h1 onClick={()=>navigate("/")}>ShareBite</h1>
      </header>
       <div className="signup-container">
    
      {/* Left: Form Card */}
      <div className="signup-form-wrapper">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      </div>


      <div className="signup-image-wrapper">
      
        <img
          src={donationImage}
          alt="Sign Up Illustration"
        />
      </div>
    </div>
    </div>
  
  );
}
