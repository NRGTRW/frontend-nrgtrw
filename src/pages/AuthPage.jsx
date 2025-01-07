import React from "react";
import "../assets/styles/auth.css"; // Ensure you have the appropriate CSS file

const AuthPage = ({ type }) => {
  const isLogin = type === "login";

  return (
    <div className="auth-page">
      <h1>{isLogin ? "Welcome Back!" : "Join the NRG Community"}</h1>
      <form>
        {!isLogin && (
          <input type="text" placeholder="Full Name" name="name" required />
        )}
        <input type="email" placeholder="Email Address" name="email" required />
        <input type="password" placeholder="Password" name="password" required />
        <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
      </form>
      <p>
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <a href={isLogin ? "/signup" : "/login"}>
          {isLogin ? "Sign Up" : "Log In"}
        </a>
      </p>
    </div>
  );
};

export default AuthPage;
