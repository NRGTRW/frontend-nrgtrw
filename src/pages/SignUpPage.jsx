import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingPage from "./LoadingPage";
import { toast } from "react-toastify";
import "../assets/styles/logIn.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // ✅ Store email in localStorage for OTP verification
      localStorage.setItem("email", formData.email);

      toast.success("Signup successful! Check your email for the OTP.");
      navigate("/verify-otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingPage />
  ) : (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">Create an Account</h1>
        <p className="auth-subtitle">Join us for seamless shopping.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="auth-input"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
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
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="auth-input"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a onClick={() => navigate("/login")} className="redirection-link">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
