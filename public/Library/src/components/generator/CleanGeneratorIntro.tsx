import React from "react";
import CleanBackground from "./CleanBackground";
import CenteredTextReceiver from "./CenteredTextReceiver";

export default function CleanGeneratorIntro({ onSubmit }: { onSubmit: (text: string) => void }) {
  const examples = [
    "We're a boutique fitness studio for busy professionals. We need a modern, energetic landing page with hero section, pricing tiers, testimonials, and a strong call-to-action.",
    "SaaS tool for freelancers to manage their projects. Minimal, clean design with features grid, pricing comparison, and customer testimonials. Focus on productivity and simplicity.",
    "Creative agency specializing in brand identity. Luxurious feel with portfolio showcase, case studies, team section, and contact form. Emphasize creativity and premium quality.",
    "E-commerce store for sustainable fashion. Eco-friendly aesthetic with product highlights, sustainability story, customer reviews, and newsletter signup."
  ];

  return (
    <div className="relative min-h-screen">
      <CleanBackground />
      <CenteredTextReceiver
        minChars={40}
        onSubmit={onSubmit}
        examples={examples}
      />
    </div>
  );
}
