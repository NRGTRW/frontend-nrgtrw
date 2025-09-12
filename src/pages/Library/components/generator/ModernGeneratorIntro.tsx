import React from "react";
import ModernBackground from "./ModernBackground";
import ModernTextReceiver from "./ModernTextReceiver";

export default function ModernGeneratorIntro({ onSubmit }: { onSubmit: (text: string) => void }) {
  const examples = [
    "We're a boutique fitness studio for busy professionals. We need a modern, energetic landing page with hero section, pricing tiers, testimonials, and a strong call-to-action.",
    "SaaS tool for freelancers to manage their projects. Minimal, clean design with features grid, pricing comparison, and customer testimonials. Focus on productivity and simplicity.",
    "Creative agency specializing in brand identity. Luxurious feel with portfolio showcase, case studies, team section, and contact form. Emphasize creativity and premium quality.",
    "E-commerce store for sustainable fashion. Eco-friendly aesthetic with product highlights, sustainability story, customer reviews, and newsletter signup."
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <ModernBackground />
      <div className="relative z-10 w-full">
        <ModernTextReceiver
          minChars={40}
          onSubmit={onSubmit}
          examples={examples}
        />
      </div>
    </div>
  );
}
