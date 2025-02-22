import React, { useState, useEffect } from "react";
import "../assets/styles/TermsAndConditions.css";

const TermsAndConditions = () => {
  // Whether the pop-up is visible
  const [visible, setVisible] = useState(true);

  // Check localStorage to see if user has accepted or declined previously
  useEffect(() => {
    const storedDecision = localStorage.getItem("termsAccepted");
    if (storedDecision === "true" || storedDecision === "false") {
      setVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("termsAccepted", "false");
    setVisible(false);
  };

  // If user has already made a decision, hide the overlay
  if (!visible) return null;

  return (
    <div className="terms-overlay">
      <div className="terms-popup">
        <h2>Terms and Conditions</h2>
        <p>
          Welcome to our website. By accessing or using our site, you agree to be
          bound by these Terms and Conditions, all applicable laws, and regulations.
          If you do not agree with any of these terms, you are prohibited from using
          or accessing this site.
        </p>

        <h3>1. Use License</h3>
        <p>
          Permission is granted to temporarily download one copy of the materials
          for personal, non-commercial transitory viewing only. This is the grant
          of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials.</li>
          <li>Use the materials for any commercial purpose.</li>
          <li>
            Attempt to decompile or reverse engineer any software on our site.
          </li>
          <li>Remove any copyright or other proprietary notations.</li>
        </ul>

        <h3>2. Disclaimer</h3>
        <p>
          The materials on our website are provided on an &ldquo;as is&rdquo; basis. We
          make no warranties, expressed or implied, and hereby disclaim and negate
          all other warranties including, without limitation, implied warranties
          or conditions of merchantability, fitness for a particular purpose, or
          non-infringement of intellectual property or other violation of rights.
        </p>

        <h3>3. Limitations</h3>
        <p>
          In no event shall we or our suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to use
          the materials on our website, even if we have been notified orally or in
          writing of the possibility of such damage.
        </p>

        <h3>4. Site Terms of Use Modifications</h3>
        <p>
          We may revise these Terms and Conditions at any time without notice.
          By using this website, you are agreeing to be bound by the current
          version of these Terms and Conditions.
        </p>

        <p>
          If you have any questions regarding these terms, please contact us at
          <em>
            {" "}
            <a href="mailto:nrgtrwsupteam@gmail.com">
              nrgtrwsupteam@gmail.com
            </a>
          </em>
          .
        </p>

        <div className="button-row">
          <button className="terms-button" onClick={handleAccept}>
            Accept
          </button>
          {/* <button className="terms-button" onClick={handleDecline}>
            Decline
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
