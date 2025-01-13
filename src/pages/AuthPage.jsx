import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/authPage.css";

const AuthPage = ({ type }) => {
  const { logIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "login") {
      try {
        await logIn(formData);
        navigate("/profile");
      } catch (error) {
        console.error("Login error:", error);
        alert("Failed to log in. Please check your credentials.");
      }
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">
          {type === "login" ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="auth-subtitle">
          {type === "login"
            ? "You're a few clicks away from seamless fashion."
            : "Join us for seamless fashion shopping."}
        </p>
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
              className="password-toggle inside-field"
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
