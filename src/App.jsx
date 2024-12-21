import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MaterialsSection from "./components/MaterialsSection";
import InspirationSection from "./components/InspirationSection";
import StylesSection from "./components/StylesSection";
import Footer from "./components/Footer";
import "./assets/styles/global.css";
import ScrollButton from "./components/ScrollButton";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <InspirationSection />
        <MaterialsSection />
        <StylesSection />
        <ScrollButton />
      </main>
      <Footer />
    </>
  );
};

export default App;
