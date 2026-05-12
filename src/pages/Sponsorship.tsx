import { Link } from "wouter";

const PACKAGES = [
  {
    name: "Platinum",
    price: "MYR 50,000",
    color: "from-slate-700 to-slate-900",
    perks: [
      "Premier logo placement (stage backdrop, lanyards, website hero)",
      "20-minute keynote slot",
      "Premium 6m × 3m exhibition booth",
      "10 complimentary delegate passes",
      "Dedicated email blast to attendee list",
      "Full-page ad in conference programme",
    ],
  },
  {
    name: "Gold",
    price: "MYR 25,000",
    color: "from-amber-400 to-yellow-600",
    perks: [
      "Logo on website, programme & main signage",
      "10-minute speaking slot in plenary",
      "3m × 3m exhibition booth",
      "5 complimentary delegate passes",
      "Half-page ad in conference programme",
    ],
    highlight: true,
  },
  {
    name: "Silver",
    price: "MYR 12,000",
    color: "from-slate-300 to-slate-500",
    perks: [
      "Logo on website & conference programme",
      "Standard 2m × 2m exhibition booth",
      "3 complimentary delegate passes",
      "Quarter-page ad in programme",
    ],
  },
  {
    name: "Bronze",
    price: "MYR 6,000",
    color: "from-orange-400 to-amber-700",
    perks: [
      "Logo on website & shared signage",
      "Tabletop exhibition space",
      "2 complimentary delegate passes",
    ],
  },
];

const ADDONS = [
  { name: "Networking Dinner Sponsor", price: "MYR 15,000" },
  { name: "Coffee Break Sponsor (per break)", price: "MYR 4,000" },
  { name: "Conference Bag Sponsor", price: "MYR 8,000" },
  { name: "Lanyard Sponsor", price: "MYR 6,000" },
];

export default function Sponsorship() {
  return (
    <div className="min-h-screen gradient-bg">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-cyan-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-12 w-auto" />
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-sm gradient-text">Particles Without Borders</div>
              <div className="text-[10px] text-muted-foreground tracking-wide uppercase">KLCC · 16 Nov 2026</div>
            </div>
          </Link>
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">← Back to Home</Link>
        </div>
      </header>

      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Sponsorship Opportunities</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">
            Partner with the leading <span className="gradient-text">air quality</span> conference in Southeast Asia.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Reach 300+ scientists, policymakers and industry leaders from 25+ countries. Showcase your technology, recruit talent, and accelerate your mission for cleaner air at KLCC, 16 November 2026.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Sponsorship Packages</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map((p) => (
              <div key={p.name} className={`relative p-7 rounded-2xl border-2 bg-white shadow-sm flex flex-col ${p.highlight ? "border-primary shadow-2xl scale-[1.02]" : "border-cyan-100"}`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">Most popular</div>
                )}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-xl font-extrabold shadow mb-4`}>
                  {p.name[0]}
                </div>
                <h3 className="text-2xl font-bold">{p.name}</h3>
                <div className="text-3xl font-extrabold gradient-text mt-2 mb-5">{p.price}</div>
                <ul className="space-y-2.5 flex-1">
                  {p.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:secretariat@particleswithoutborders.com?subject=Sponsorship%20enquiry%20-%20"
                  className="mt-6 text-center w-full py-3 rounded-full font-semibold bg-foreground text-background hover:opacity-90"
                >
                  Enquire
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">À la carte add-ons</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADDONS.map((a) => (
              <div key={a.name} className="p-6 rounded-2xl bg-white border border-cyan-100 shadow-sm">
                <div className="font-semibold mb-1">{a.name}</div>
                <div className="text-primary font-extrabold text-lg">{a.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Ready to partner with us?</h2>
          <p className="opacity-90 mb-6">Email the secretariat to receive the full sponsorship prospectus.</p>
          <a
            href="mailto:secretariat@particleswithoutborders.com?subject=Sponsorship%20Prospectus%20Request"
            className="inline-block px-8 py-3.5 rounded-full bg-white text-primary font-semibold shadow-xl hover:-translate-y-0.5 transition"
          >
            secretariat@particleswithoutborders.com
          </a>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-slate-900 via-cyan-950 to-emerald-950 text-white py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-cyan-200/70">
          © 2026 Particles Without Borders · KLCC, Kuala Lumpur
        </div>
      </footer>
    </div>
  );
}
