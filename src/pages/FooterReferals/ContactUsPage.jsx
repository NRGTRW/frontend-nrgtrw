import React from "react";
import "./generalPage.css";

const ContactUs = () => {
  return (
    <div className="general-page">
      <h1>Contact Us</h1>
      <p>Have a question or need support? Reach out to us:</p>
      <p>
        Email:{" "}
        <a href="mailto:nrgtrwsupteam@gmail.com">nrgtrwsupteam@gmail.com</a>
      </p>
      <p>Phone: +359 89 733 8635</p>
      <p>Follow us on social media for updates and exclusive offers.</p>
    </div>
  );
};

export default ContactUs;
