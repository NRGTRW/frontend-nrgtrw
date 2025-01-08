import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/authPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Submit data to the server (you'll need to implement API logic)
    console.log("SignUp Data:", formData);

    // Navigate to Profile page after successful signup
    navigate("/profile");
  };

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
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="auth-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">Sign Up</button>
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
