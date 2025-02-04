import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import LoaderModal from "../components/LoaderModal.jsx"; // Import the LoaderModal
import { toast } from "react-toastify";
import "../assets/styles/verifyOTP.css";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      toast.error("Email is missing. Please sign up again.");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader

    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("authToken", response.data.token); // Store token
      toast.success("🔓 Verification successful! Welcome aboard.");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || "🚫 Incorrect code! Please check and enter the correct verification code.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <>
      {isLoading && <LoaderModal message="Verifying..." />}
      <div className="otp-page">
        <div className="otp-container">
          <h2 className="otp-header">Email Verification</h2>
          <p className="otp-description">
            Enter the 6-digit Verification code sent to your email to verify your account.
          </p>
          <form className="otp-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="otp-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
              disabled={isLoading}
            />
            <button type="submit" className="otp-button" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyOTPPage;
