import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingPage from "./LoadingPage"; // Loader for loading state
import { toast } from "react-toastify"; // Toast notifications for feedback
import "../assets/styles/logIn.css";

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
    setIsLoading(true); // Start loader

    try {
      // API call to log the user in
      const response = await api.post("/auth/login", formData);
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      toast.success("Login successful!");
      navigate("/profile", { replace: true }); // Redirect to profile page
    } catch (error) {
      console.error("Login failed:", error);

      // Distinguish between 404 (user not found) and 401 (wrong password)
      if (error.response?.status === 404) {
        toast.error("No account found with that email address.");
      } else if (error.response?.status === 401) {
        toast.error("Incorrect password. Please try again.");
      } else {
        // For other errors, show a generic message or use the server's
        toast.error(error.response?.data?.error || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  // Handle password reset (optional feature)
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
      console.error("Password reset failed:", error.message);
      toast.error(
        error.response?.data?.message || "Failed to send password reset email."
      );
    }
  };

  return isLoading ? (
    <LoadingPage message="Logging you in..." />
  ) : (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">LOG IN</h1>
        <p className="auth-subtitle">Welcome back! Please log in.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          {/* Password Input */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="auth-input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Forgot Password and Sign Up Links */}
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
            <a onClick={() => navigate("/signup")} className="redirection-link">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
