import React, { useEffect, useRef, useState } from "react";

type Props = {
  minChars?: number;
  onSubmit: (text: string) => void;
  examples?: string[];
};

export default function TextReceiver({ minChars = 40, onSubmit, examples = [] }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => { 
    ref.current?.focus(); 
  }, []);

  const tooShort = text.trim().length < minChars;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!tooShort) {
        onSubmit(text);
      }
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4">
      <div className="backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl shadow-lg p-4 md:p-6 hover:border-white/25 transition-colors">
        <label htmlFor="speech" className="block text-sm font-medium text-white/80 mb-2">
          Describe what you want. We'll build the page.
        </label>

        <div className="rounded-xl border border-white/10 focus-within:border-transparent">
          <div className="rounded-xl px-4 py-3 md:px-5 md:py-4">
            <textarea
              id="speech"
              ref={ref}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyPress={handleKeyPress}
              rows={8}
              placeholder="Speak naturally. Example: We're a boutique gym for busy professionals… I need a bold hero, 3-tier pricing, and testimonials."
              className="w-full resize-none bg-transparent outline-none placeholder-white/50 text-base md:text-lg leading-7 text-white"
              aria-describedby="speech-help"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-white/60">
          <p id="speech-help">Tip: mention sections you want (hero, pricing, FAQ…). Shift+Enter for a new line.</p>
          <span>{text.trim().length}/{minChars}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setText(ex)}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:border-white/25 transition-colors"
              aria-label={`Use example: ${ex}`}
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => !tooShort && onSubmit(text)}
            disabled={tooShort}
            className={`px-4 py-2 rounded-xl transition ${
              tooShort
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white/90 text-black hover:bg-white"
            }`}
            aria-disabled={tooShort}
            aria-label="Generate draft"
          >
            Generate draft
          </button>
          <span className="text-xs text-white/60 self-center hidden md:inline">
            Enter to send • Shift+Enter for newline
          </span>
        </div>
      </div>
    </div>
  );
}