import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../assets/styles/authPage.css";

const AuthPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/profile");
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handlePasswordReset = async () => {
    const email = prompt("Enter your email address:");
    if (!email) return;

    try {
      await api.post("/auth/reset-password", { email });
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to send password reset email."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">LOG IN</h1>
        <p className="auth-subtitle">Welcome back! Please log in</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="auth-input with-toggle"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>
        <div className="auth-footer">
          <button
            type="button"
            className="reset-password-link"
            onClick={handlePasswordReset}
            style={{
              background: "none",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Forgot Password?
          </button>
          <p>
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/signup")}
              className="redirection-link"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
