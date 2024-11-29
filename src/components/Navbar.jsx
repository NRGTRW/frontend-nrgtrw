import React from "react";
import { Link } from "react-scroll";
import "../assets/styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">NRG</div>
      <ul className="nav-links">
        <li><Link to="materials" smooth={true} duration={500}>Our Materials</Link></li>
        <li><Link to="styles" smooth={true} duration={500}>Styles</Link></li>
        <li><Link to="inspiration" smooth={true} duration={500}>Inspiration</Link></li>
        <li><Link to="faq" smooth={true} duration={500}>FAQs</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
