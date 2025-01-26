/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../assets/styles/logIn.css";
import LoadingPage from "./LoadingPage";
import { toast } from "react-toastify";

const LogInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", formData);
      const token = response.data.token;
  
      // Store the token in localStorage
      localStorage.setItem("authToken", token);
  
      toast.success("Login successful!");
      navigate("/profile", { replace: true, state: { fromLogin: true } });
    } catch (error) {
      console.error("Login failed:", error.message);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handlePasswordReset = async () => {
    const email = prompt("Enter your email address:");
    if (!email) {
      toast.error("Email is required for password reset.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await api.post("/auth/reset-password", { email });
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password reset failed:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Failed to send password reset email."
      );
    }
  };

  return isLoading ? (
    <LoadingPage />
  ) : (
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
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading} // Disable while loading
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <div className="auth-footer">
          <button
            type="button"
            className="reset-password-link"
            onClick={handlePasswordReset}
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

export default LogInPage;
