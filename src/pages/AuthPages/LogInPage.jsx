/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./logIn.css";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const OAUTH_SUCCESS_PATH = "/oauth-success";

const LogInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();
  const { loadWishlist } = useWishlist();

  useEffect(() => {
    // Handle OAuth redirect
    if (window.location.pathname === OAUTH_SUCCESS_PATH) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("authToken", token);
        navigate("/profile", { replace: true });
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
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
          error.response?.data?.error || "Login failed. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = formData.email.trim();

    if (!email) {
      toast.error(
        "Please enter your email in the login field before resetting your password.",
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error(
        "📩 Invalid email! Make sure you enter a properly formatted email.",
      );
      return;
    }

    try {
      await api.post("/auth/reset-password", { email });
      toast.success(
        "📧 Reset email sent! Follow the instructions in your inbox.",
      );
      toast.info(
        "📩 Didn’t receive the email? Check your spam or junk folder.",
      );
    } catch (error) {
      console.error("Password reset failed:", error.message);
      toast.error(
        error.response?.data?.message || "Failed to send password reset email.",
      );
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">LOG IN</h1>
        <p className="auth-subtitle">Welcome back! Please log in.</p>
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
            <button
              type="button"
              className="reset-password-link"
              onClick={handlePasswordReset}
              style={{
                position: "absolute",
                right: "0px",
                top: "100%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgb(51 51 51)",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Log In"}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="auth-button social-login google"
            onClick={() => handleSocialLogin("google")}
            style={{
              background: "#fff",
              color: "#333",
              border: "1px solid #ccc",
              marginBottom: 8,
            }}
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              style={{ width: 20, marginRight: 8, verticalAlign: "middle" }}
            />
            Continue with Google
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
