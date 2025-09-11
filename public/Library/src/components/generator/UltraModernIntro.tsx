import React from "react";
import GlobalBackground from "../GlobalBackground";
import UltraModernReceiver from "./UltraModernReceiver";

export default function UltraModernIntro({ onSubmit }: { onSubmit: (text: string) => void }) {
  const examples = [
    "We're a cutting-edge SaaS platform revolutionizing how teams collaborate. We need a modern, sleek landing page that showcases our AI-powered features, includes social proof from Fortune 500 companies, offers flexible pricing tiers, and drives sign-ups with compelling CTAs.",
    "Boutique fitness studio specializing in high-intensity interval training for busy professionals. We want a dynamic, energetic landing page with hero section, class schedules, trainer profiles, membership tiers, and seamless booking integration.",
    "Creative agency focused on brand identity and digital marketing for luxury brands. We need a sophisticated, premium landing page with portfolio showcase, case studies, team expertise, service packages, and elegant contact forms.",
    "E-commerce platform for sustainable fashion and eco-friendly products. We want a clean, earth-toned landing page featuring product highlights, sustainability mission, customer testimonials, and newsletter signup with environmental impact metrics."
  ];

  return (
    <div className="relative min-h-screen">
      <GlobalBackground />
      <UltraModernReceiver
        minChars={40}
        onSubmit={onSubmit}
        examples={examples}
      />
    </div>
  );
}
