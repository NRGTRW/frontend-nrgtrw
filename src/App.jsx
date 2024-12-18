import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import "./assets/styles/navbar.css";
import "./assets/styles/hero.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default App;
