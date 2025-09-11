import React from "react";
import BackgroundDecor from "./BackgroundDecor";
import TextReceiver from "./TextReceiver";

export default function GeneratorIntro({ onSubmit }: { onSubmit: (text: string) => void }) {
  return (
    <div className="relative min-h-[calc(100dvh-64px)] flex items-center justify-center">
      <BackgroundDecor />
      <TextReceiver
        minChars={40}
        onSubmit={onSubmit}
        examples={[
          "We're a boutique gym for busy professionals. Need bold hero, 3-tier pricing, testimonials.",
          "SaaS tool for freelancers. Minimal tone. Need features grid, metrics, social proof, FAQ.",
          "Creative agency. Lux feel. Case highlight + testimonials + contact CTA."
        ]}
      />
    </div>
  );
}
