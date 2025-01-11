import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import "../assets/styles/authPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Simulate signup success and navigate to profile
    setTimeout(() => {
      console.log("SignUp Data:", formData);
      navigate("/profile");
    }, 2500); // Transition after loading
  };

  if (isLoading) {
    return <LoadingPage onFinish={() => navigate("/profile")} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">Create an Account</h1>
        <p className="auth-subtitle">Join us for seamless fashion shopping.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="auth-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
              className="auth-input with-toggle"
              value={formData.password}
              onChange={handleChange}
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
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="auth-input with-toggle"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle inside-field"
              onClick={toggleConfirmPasswordVisibility}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a onClick={() => navigate("/login")} className="redirection-link">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
