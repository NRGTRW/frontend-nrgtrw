/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import "../assets/styles/authPage.css";

const AuthPage = ({ type }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate authentication success
    setIsLoading(true);

    setTimeout(() => {
      navigate("/profile");
    }, 2500); // Transition after loading
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (isLoading) {
    return <LoadingPage onFinish={() => navigate("/profile")} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">Welcome Back</h1>
        <p className="auth-subtitle">You're a few clicks away from seamless fashion.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          <button type="submit" className="auth-button">
            {type === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>
        <div className="auth-footer">
          {type === "login" ? (
            <p>
              Don’t have an account?{" "}
              <a onClick={() => navigate("/signup")} className="redirection-link">
                Sign up here
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <a onClick={() => navigate("/login")} className="redirection-link">
                Log in here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
