import { SparklesIcon, PhotoIcon } from '@heroicons/react/24/outline';

const defaultColors = {
  // Light Mode
  primary: '#c5a47f',
  primaryHover: '#b08f6a',
  backgroundLight: '#f9f9f9',
  textLight: '#2a2a2a',
  borderLight: '#e5e7eb',
  cardLight: '#ffffff',
  
  // Dark Mode
  primaryDark: '#d4af37',
  primaryHoverDark: '#c5a347',
  backgroundDark: '#0a0a0a',
  textDark: '#f5f5f5',
  borderDark: '#333333',
  cardDark: '#1a1a1a',
};

const ThemeWrapper = ({ children }) => (
  <div>
    {children}
  </div>
);

export const Generate1 = () => (
  <ThemeWrapper>
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      <div className="p-6 sm:p-12 border-r border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-[#c5a47f]/10 rounded-full flex items-center justify-center text-[#c5a47f]">
              1
            </div>
            <h2 className="font-playfair text-xl sm:text-2xl text-gray-900">
              Describe Your Vision
            </h2>
          </div>
          <textarea 
            className="w-full bg-white rounded-xl p-4 sm:p-6 h-48 border border-[#c5a47f]/30 focus:border-[#c5a47f] placeholder:text-gray-400 transition-colors"
            placeholder="Modern luxury hotel website with dark theme..." 
          />
          <button className="mt-6 w-full py-3 bg-[#c5a47f] hover:bg-[#b8946a] text-white rounded-xl transition-colors">
            Generate Concepts
          </button>
        </div>
      </div>
      <div className="p-6 sm:p-12 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-xl">
          <div className="aspect-video bg-white rounded-xl border border-[#c5a47f]/20 animate-pulse" />
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-white rounded-lg border border-[#c5a47f]/20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </ThemeWrapper>
);

export const Generate2 = () => (
  <ThemeWrapper>
    <div className="min-h-screen bg-white flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <h1 className="font-playfair text-xl sm:text-3xl text-gray-900 mb-4">AI Configuration</h1>
              <input 
                className="w-full bg-white rounded-lg p-3 sm:p-4 mb-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#c5a47f]"
                placeholder="Website Purpose"
              />
              <input 
                className="w-full bg-white rounded-lg p-3 sm:p-4 mb-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#c5a47f]"
                placeholder="Target Audience"
              />
              <button className="w-full py-3 bg-[#c5a47f] hover:bg-[#b8946a] text-white rounded-lg transition-colors">
                Generate Preview
              </button>
            </div>
            <div className="w-full sm:w-96 bg-white rounded-xl p-4">
              <div className="aspect-video bg-white rounded-lg border border-[#c5a47f]/30 animate-pulse" />
              <div className="mt-2 text-xs text-gray-600 text-center">Live AI Preview</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ThemeWrapper>
);

//GOAT
export const Generate3 = () => (
  <ThemeWrapper>
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-6 sm:p-12">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#c5a47f]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#c5a47f] rounded-full pulse-ring" />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl text-gray-900 mb-2">
            Architectural Blueprint
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Detail every aspect of your digital vision
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <textarea 
            className="w-full bg-white rounded-xl p-4 sm:p-6 h-40 border border-[#c5a47f]/20 focus:border-[#c5a47f] placeholder:text-gray-400 transition-colors"
            placeholder="Describe materials, layouts, and user flow..." 
          />
          <div className="mt-6 flex gap-4 justify-between">
            <button className="px-4 py-2 border border-[#c5a47f]/50 text-[#c5a47f] rounded-lg hover:border-[#c5a47f] transition-colors">
              Attach Files
            </button>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-gray-600 hover:text-[#c5a47f] transition-colors">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-[#c5a47f] text-white rounded-lg hover:bg-[#b8946a] transition-colors">
                Render Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ThemeWrapper>
);

export const Generate4 = () => (
  <ThemeWrapper>
    <div className="min-h-screen bg-white grid md:grid-cols-3">
      <aside className="md:col-span-1 bg-white p-6 border-r border-gray-200">
        <nav className="space-y-6">
          {['Foundation', 'Aesthetics', 'Content', 'Review'].map((item, idx) => (
            <div key={item} className="flex items-center gap-4 group cursor-pointer">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                idx === 0 ? 'bg-[#c5a47f] text-white' : 'bg-[#c5a47f]/10'
              }`}>
                {idx + 1}
              </div>
              <span className={`transition-colors ${
                idx === 0 ? 'text-[#c5a47f]' : 'text-gray-600'
              } group-hover:text-[#c5a47f]`}>
                {item}
              </span>
            </div>
          ))}
        </nav>
      </aside>
      <main className="md:col-span-2 p-6 sm:p-12 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-xl sm:text-2xl text-gray-900 mb-6">
            Brand Essence
          </h2>
          <div className="space-y-6">
            <input 
              className="w-full bg-white p-3 sm:p-4 rounded-lg border border-[#c5a47f]/20 focus:ring-2 focus:ring-[#c5a47f] placeholder:text-gray-400"
              placeholder="Core Values" 
            />
            <textarea 
              className="w-full bg-white p-3 sm:p-4 rounded-lg border border-[#c5a47f]/20 h-32 focus:ring-2 focus:ring-[#c5a47f] placeholder:text-gray-400"
              placeholder="Brand Story" 
            />
            <div className="border-t border-gray-200 pt-6">
              <button className="px-6 py-2 bg-[#c5a47f] text-white rounded-lg hover:bg-[#b8946a] transition-colors">
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </ThemeWrapper>
);

export const Generate5 = () => (
  <ThemeWrapper>
    <div className="min-h-screen bg-white p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <aside className="sticky top-24 w-full sm:w-64 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-playfair text-[#c5a47f] mb-4 text-lg">
              AI Co-Creation
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#c5a47f] rounded-full" />
                Define core objectives
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--primary)]/80 dark:bg-[var(--primaryDark)]/80 rounded-full" />
                Select style parameters
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--primary)]/60 dark:bg-[var(--primaryDark)]/60 rounded-full" />
                Refine iterations
              </p>
            </div>
          </aside>
          <main className="flex-1 bg-white rounded-xl p-6 sm:p-8 shadow-lg">
            <div className="space-y-6">
              <div className="aspect-video bg-white rounded-xl border-2 border-dashed border-[#c5a47f]/30 flex items-center justify-center">
                <div className="text-center">
                  <SparklesIcon className="w-8 h-8 text-[#c5a47f] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">AI-generated preview area</p>
                </div>
              </div>
              <textarea
                className="w-full bg-white rounded-xl p-4 sm:p-6 h-48 border border-[#c5a47f]/30 focus:ring-2 focus:ring-[#c5a47f] placeholder:text-gray-400"
                placeholder="Input your creative directives..." 
              />
              <div className="flex justify-end gap-4">
                <button className="px-6 py-2 border border-[#c5a47f]/50 text-[#c5a47f] rounded-lg hover:border-[#c5a47f] transition-colors">
                  Reset
                </button>
                <button className="px-6 py-2 bg-[#c5a47f] text-white rounded-lg hover:bg-[#b8946a] transition-colors">
                  Generate
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </ThemeWrapper>
);
export const Generate6 = () => (
  <ThemeWrapper>
    <div className="min-h-screen bg-white p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-8">
            {['Foundation', 'Style', 'Content'].map((step, idx) => (
              <div key={step} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-[#c5a47f] text-white' : 'bg-[#c5a47f]/10'}`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-playfair text-gray-900">{step}</h3>
                  <p className="text-sm text-gray-600 mt-1">Phase {idx + 1} description</p>
                </div>
              </div>
            ))}
          </div>
          <div className="md:w-2/3 bg-white rounded-xl p-6 sm:p-8">
            <textarea
              className="w-full bg-white rounded-lg p-4 h-64 border border-[#c5a47f]/30 focus:ring-2 focus:ring-[#c5a47f]"
              placeholder="Enter your requirements..."
            />
            <button className="mt-6 px-8 py-3 bg-[#c5a47f] hover:bg-[#b8946a] text-white rounded-lg transition-colors">
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  </ThemeWrapper>
);

export const Generate7 = () => (
  <ThemeWrapper>
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      <div className="p-6 sm:p-12 bg-[#c5a47f]/5 border-r border-[var(--primary)]/20 dark:border-[var(--primaryDark)]/20">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#c5a47f] rounded-lg flex items-center justify-center text-white mb-4">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h2 className="font-playfair text-2xl text-gray-900">AI-Powered Creation</h2>
          </div>
          <div className="space-y-6">
            <input
              className="w-full bg-white rounded-lg p-3 border border-[#c5a47f]/30 focus:ring-2 focus:ring-[#c5a47f]"
              placeholder="Project Name"
            />
            <select className="w-full bg-white rounded-lg p-3 border border-[#c5a47f]/30 focus:ring-2 focus:ring-[#c5a47f]">
              <option>Select Industry</option>
              <option>Luxury Retail</option>
              <option>Hospitality</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-12 bg-white">
        <div className="max-w-md mx-auto">
          <div className="aspect-video bg-white rounded-xl border-2 border-dashed border-[#c5a47f]/30 flex items-center justify-center">
            <div className="text-center">
              <PhotoIcon className="w-8 h-8 text-[#c5a47f] mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload reference images</p>
            </div>
          </div>
          <button className="mt-8 w-full py-3 bg-[#c5a47f] hover:bg-[#b8946a] text-white rounded-xl transition-colors">
            Generate Prototype
          </button>
        </div>
      </div>
    </div>
  </ThemeWrapper>
);