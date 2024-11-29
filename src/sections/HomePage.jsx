import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "./HeroSection";
import MaterialsSection from "./MaterialsSection";
import StylesSection from "./StylesSection";
import InspirationSection from "./InspirationSection";
import FAQSection from "./FAQSection";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <MaterialsSection />
      <StylesSection />
      <InspirationSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;
