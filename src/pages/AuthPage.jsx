import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/authPage.css"; // Ensure you have the appropriate CSS file

const AuthPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for login/signup
    navigate("/profile");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-header">Welcome Back</h1>
        <p className="auth-subtitle">You're one click away from seamless fashion.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email Address" className="auth-input" required />
          <input type="password" placeholder="Password" className="auth-input" required />
          <button type="submit" className="auth-button">Log In</button>
        </form>
        <div className="auth-footer">
          <p>
            Don’t have an account?{" "}
            <a onClick={() => navigate("/signup")}>Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
