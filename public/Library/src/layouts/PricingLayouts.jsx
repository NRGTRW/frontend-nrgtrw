

const PricingBase = ({ children }) => (
  <div className="min-h-screen bg-white">
    {children}
  </div>
);

export const Pricing1 = ({ colors }) => (
  <PricingBase>
    <div className="container mx-auto max-w-6xl px-6 py-24 sm:py-36">
      <div className="mb-16 sm:mb-32 text-center">
        <h2 className="mb-6 font-playfair text-3xl sm:text-5xl text-gray-900">Transparent Excellence</h2>
        <div className="mx-auto h-0.5 w-24 bg-[#c5a47f]/80" />
      </div>
      <div className="grid gap-8 sm:gap-16 lg:grid-cols-2">
        <div className="relative rounded-[2.5rem] border-2 border-[#c5a47f]/10 bg-white p-8 sm:p-14 shadow-2xl shadow-[#c5a47f]/5">
          <div className="absolute top-6 right-6 bg-[#c5a47f]/10 px-4 py-1 rounded-full text-sm text-[#c5a47f]">AI-Powered</div>
          <h3 className="mb-6 font-cormorant text-2xl sm:text-3xl text-[#c5a47f]">Intelligent Solution</h3>
          <div className="mb-8 font-playfair text-4xl sm:text-5xl">$50<span className="text-lg text-gray-600 ml-2">/project</span></div>
          <button className="w-full rounded-xl bg-[#c5a47f] py-4 text-lg text-white hover:bg-[#b8946a] transition-all duration-300">Begin Creation</button>
        </div>
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#c5a47f]/10 to-[#c5a47f]/5 border border-[#c5a47f]/20 p-8 sm:p-14 backdrop-blur-sm">
          <h3 className="mb-6 font-cormorant text-2xl sm:text-3xl text-[#c5a47f]">Bespoke Mastery</h3>
          <div className="mb-8 font-playfair text-4xl sm:text-5xl">$500+<span className="text-lg text-gray-600 ml-2">/engagement</span></div>
          <button className="w-full rounded-xl border-2 border-[#c5a47f] py-4 text-lg text-[#c5a47f] hover:bg-[#c5a47f]/10 transition-all duration-300">Schedule Consultation</button>
        </div>
      </div>
    </div>
  </PricingBase>
);

export const Pricing2 = ({ colors }) => (
  <PricingBase>
    <div className="container mx-auto max-w-7xl px-6 py-24 sm:py-36">
      <div className="grid gap-8 lg:grid-cols-3">
        {[['Essential', '$50', 'Starter package'], ['Prestige', '$500+', 'Most popular'], ['Imperial', 'Custom', 'Enterprise solution']].map(([title, price, subtitle], idx) => (
          <div key={title} className={`relative rounded-[2.5rem] ${idx === 1 ? 'bg-gradient-to-b from-[#c5a47f]/20 to-transparent border border-[#c5a47f]/30' : 'bg-white'} p-8 sm:p-14 backdrop-blur-sm`}>
            {idx === 1 && <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#c5a47f] px-4 py-2 rounded-full text-sm text-white">Premium Choice</div>}
            <h3 className="mb-2 font-cormorant text-2xl text-[#c5a47f]">{title}</h3>
            <p className="mb-6 text-sm text-gray-600">{subtitle}</p>
            <div className={`mb-8 font-playfair text-4xl ${idx === 1 ? 'text-white' : 'text-[#c5a47f]'}`}>{price}</div>
            <button className={`w-full rounded-xl py-4 text-lg transition-all duration-300 ${idx === 1 ? 'bg-white text-[#c5a47f] hover:bg-opacity-90' : 'border-2 border-[#c5a47f] text-[#c5a47f] hover:bg-[#c5a47f]/10'}`}>
              {idx === 0 ? 'Get Started' : idx === 1 ? 'Elevate Experience' : 'Contact Team'}
            </button>
          </div>
        ))}
      </div>
    </div>
  </PricingBase>
);

export const Pricing3 = ({ colors }) => (
  <PricingBase>
    <div className="container mx-auto max-w-5xl px-6 py-24 sm:py-36">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 rounded-[2.5rem] bg-white p-8 sm:p-14 shadow-xl">
          <h3 className="mb-8 font-playfair text-3xl text-[#c5a47f]">Essential AI</h3>
          <div className="mb-8 font-cormorant text-5xl">$50</div>
          <div className="mb-12 space-y-5">
            {['Advanced templates', 'AI content engine', 'Global CDN', 'Priority support'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-900">
                <div className="h-2 w-2 rounded-full bg-[#c5a47f]" /> {item}
              </div>
            ))}
          </div>
          <button className="w-full rounded-xl border-2 border-[#c5a47f] py-4 text-lg text-[#c5a47f] hover:bg-[#c5a47f]/10 transition-all">Start Journey</button>
        </div>
        <div className="lg:w-1/2 rounded-[2.5rem] bg-gradient-to-tr from-[#c5a47f]/15 to-transparent p-8 sm:p-14 border border-[#c5a47f]/20">
          <div className="mb-8 flex justify-between items-center">
            <h3 className="font-playfair text-3xl text-[#c5a47f]">Custom Elite</h3>
            <div className="bg-[#c5a47f]/20 px-4 py-2 rounded-full text-sm">Tailored Solution</div>
          </div>
          <div className="mb-8 font-cormorant text-5xl">$500+</div>
          <div className="mb-12 space-y-5">
            {['White-glove service', 'Dedicated team', 'Enterprise security', '24/7 concierge'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-[#c5a47f]" /> {item}
              </div>
            ))}
          </div>
          <button className="w-full rounded-xl bg-[#c5a47f] py-4 text-lg text-white hover:bg-[#b8946a] transition-all">Request Proposal</button>
        </div>
      </div>
    </div>
  </PricingBase>
);

export const Pricing4 = ({ colors }) => (
  <PricingBase>
    <div className="container mx-auto max-w-6xl px-6 py-24 sm:py-36">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-[#c5a47f]/30">
            <th className="py-6 text-left font-playfair text-2xl text-gray-900">Features</th>
            <th className="py-6 text-center font-playfair text-2xl text-[#c5a47f]">Standard</th>
            <th className="py-6 text-center font-playfair text-2xl text-[#c5a47f]">Premium</th>
          </tr>
        </thead>
        <tbody>
          {['Implementation speed', 'Support level', 'Custom domains', 'Team members'].map((feature, idx) => (
            <tr key={feature} className={`border-b border-[#c5a47f]/10 ${idx % 2 === 0 ? 'bg-white' : ''}`}>
              <td className="px-6 py-5 font-cormorant text-lg text-gray-900">{feature}</td>
              <td className="px-6 py-5 text-center font-cormorant text-lg">1-3 days</td>
              <td className="px-6 py-5 text-center font-cormorant text-lg">Instant deployment</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </PricingBase>
);

export const Pricing5 = ({ colors }) => (
  <PricingBase>
    <div className="container mx-auto max-w-3xl px-6 py-24 sm:py-36">
      <div className="flex flex-col gap-8">
        <div className="rounded-[2.5rem] bg-white p-8 sm:p-14 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-3 font-playfair text-2xl text-[#c5a47f]">AI Foundation</h3>
              <p className="text-sm text-gray-600">Smart starting point</p>
            </div>
            <div className="font-cormorant text-4xl">$50</div>
          </div>
        </div>
        <div className="rounded-[2.5rem] border-2 border-[#c5a47f]/30 bg-gradient-to-r from-[#c5a47f]/10 to-transparent p-8 sm:p-14 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-3 font-playfair text-2xl text-[#c5a47f]">Custom Excellence</h3>
              <p className="text-sm text-gray-600">Tailored perfection</p>
            </div>
            <div className="font-cormorant text-4xl">$500+</div>
          </div>
        </div>
      </div>
    </div>
  </PricingBase>
);

export const Pricing6 = ({ colors }) => (
  <PricingBase>
    <div className="container mx-auto max-w-4xl px-6 py-24 sm:py-36">
      <div className="grid gap-8 sm:gap-12">
        <div className="text-center">
          <h2 className="mb-6 font-playfair text-3xl sm:text-4xl text-gray-900">Tiered Excellence</h2>
          <p className="text-sm text-gray-600 mx-auto max-w-xl">Select your level of sophistication</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[['Essence', '49', 'Core features'], ['Eminence', '499', 'Full package'], ['Excellence', 'Custom', 'Enterprise']].map(([title, price, desc], idx) => (
            <div key={title} className={`rounded-[2rem] ${idx === 1 ? 'border-2 border-[#c5a47f]/40 bg-gradient-to-b from-[#c5a47f]/15 to-transparent' : 'bg-white'} p-8 sm:p-10`}>
              <h3 className="mb-2 font-cormorant text-xl text-[#c5a47f]">{title}</h3>
              <div className="mb-4 font-playfair text-4xl">{price}<span className="text-sm">{idx < 2 ? '/project' : ''}</span></div>
              <p className="mb-8 text-sm text-gray-600">{desc}</p>
              <button className={`w-full rounded-xl py-3 text-sm transition-all ${idx === 1 ? 'bg-[#c5a47f] text-white hover:bg-[#b8946a]' : 'border border-[#c5a47f]/30 hover:bg-[#c5a47f]/10'}`}>
                {idx === 0 ? 'Start Now' : idx === 1 ? 'Choose Excellence' : 'Contact'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PricingBase>
);

export const Pricing7 = ({ colors }) => (
  <PricingBase>
    <div className="container mx-auto max-w-2xl px-6 py-24 sm:py-36">
      <div className="text-center mb-16">
        <h2 className="mb-4 font-playfair text-3xl sm:text-4xl text-gray-900">Minimalist Luxury</h2>
        <div className="mx-auto h-px w-24 bg-[#c5a47f]/80" />
      </div>
      <div className="space-y-8">
        <div className="rounded-[2rem] border-2 border-[#c5a47f]/20 p-8 sm:p-12 transition-all hover:border-[#c5a47f]/40">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-cormorant text-xl text-[#c5a47f]">Digital Foundation</h3>
              <p className="text-sm text-gray-600">Essential package</p>
            </div>
            <div className="font-playfair text-3xl">$50</div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-[#c5a47f]/10 border border-[#c5a47f]/30 p-8 sm:p-12 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-cormorant text-xl text-[#c5a47f]">Concierge Service</h3>
              <p className="text-sm text-gray-600">White-glove treatment</p>
            </div>
            <div className="font-playfair text-3xl">$500+</div>
          </div>
        </div>
      </div>
    </div>
  </PricingBase>
);