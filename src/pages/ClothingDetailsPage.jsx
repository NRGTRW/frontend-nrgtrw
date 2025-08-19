import React from "react";
import HeroSection from "../components/HomePageSections/HeroSection";
import InspirationSection from "../components/HomePageSections/InspirationSection";
import StylesSection from "../components/HomePageSections/StylesSection";
import ScrollButton from "../Globals/ScrollButton";

const ClothingDetailsPage = () => {
  return (
    <>
      <HeroSection />
      <InspirationSection />
      <StylesSection />
      <ScrollButton />
    </>
  );
};

export default ClothingDetailsPage;
