import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "../assets/styles/authPage.css"; // Ensure you have this CSS file for styles

const AuthPage = ({ type }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "signup") {
        await axios.post("/auth/signup", formData);
        navigate("/login");
      } else {
        const { data } = await axios.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", data.token);
        navigate("/profile");
      }
    } catch (error) {
      setError(error.response?.data.message || "An error occurred");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">{type === "signup" ? "Sign Up" : "Log In"}</h1>
        <p className="auth-subtitle">
          {type === "signup" ? "Create your account" : "Welcome back! Please log in"}
        </p>
        {error && <p className="error-message">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {type === "signup" && (
            <input
              type="text"
              name="name"
              className="auth-input"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          )}
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="auth-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {type === "signup" && (
            <input
              type="text"
              name="profilePicture"
              className="auth-input"
              placeholder="Profile Picture URL"
              value={formData.profilePicture}
              onChange={handleInputChange}
            />
          )}
          <button type="submit" className="auth-button">
            {type === "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>
        <div className="auth-footer">
          {type === "signup" ? (
            <p>
              Already have an account?{" "}
              <a className="redirection-link" onClick={() => navigate("/login")}>
                Log In
              </a>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <a className="redirection-link" onClick={() => navigate("/signup")}>
                Sign Up
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
