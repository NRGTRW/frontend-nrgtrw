/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // For password reset endpoint
import { toast } from "react-toastify"; // Toast notifications for feedback
import "../assets/styles/logIn.css";
import { useAuth } from "../context/AuthContext"; // Use AuthContext for login
import { useWishlist } from "../context/WishlistContext"; // For refreshing wishlist

const LogInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get login function from AuthContext and loadWishlist from WishlistContext
  const { login } = useAuth();
  const { loadWishlist } = useWishlist();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use AuthContext's login function to update auth state
      await login(formData);
      // Explicitly refresh the wishlist after login
      await loadWishlist();
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response?.status === 404) {
        toast.error("No account found with that email address.");
      } else if (error.response?.status === 401) {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error(
          error.response?.data?.error || "Login failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fixed Password Reset Function with Spam Warning
  const handlePasswordReset = async () => {
    const email = formData.email.trim(); // Take email directly from input field

    if (!email) {
      toast.error("Please enter your email in the login field before resetting your password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("📩 Invalid email! Make sure you enter a properly formatted email.");
      return;
    }

    try {
      await api.post("/auth/reset-password", { email });
      toast.success("📧 Reset email sent! Follow the instructions in your inbox.");
      toast.info("📩 Didn’t receive the email? Check your spam or junk folder.");
    } catch (error) {
      console.error("Password reset failed:", error.message);
      toast.error(
        error.response?.data?.message || "Failed to send password reset email."
      );
    }
  };

  return (
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

          {/* Submit Button with Inline Loading Spinner */}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Log In"}
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
