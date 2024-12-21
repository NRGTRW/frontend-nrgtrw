import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import InspirationSection from "../components/InspirationSection";
import StylesSection from "../components/StylesSection";
import ScrollButton from "../components/ScrollButton";

const HomePage = () => {

  return (
    <>
      <HeroSection />
      <InspirationSection />
      <StylesSection />
      <ScrollButton /> 
    </>
  );
};

export default HomePage;
