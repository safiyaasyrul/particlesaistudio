import { Link } from "wouter";

const logoUrl = "/logo.png";

const MAIN_ORGANIZERS = [
  {
    name: "Particles Plus",
    logo: "/particles-plus-logo.png",
    url: "https://www.particlesplus.com",
    desc: "A world leader in particle counter instruments and air quality monitoring technology, providing cutting-edge solutions for environmental and occupational health applications.",
    country: "USA",
  },
  {
    name: "Universiti Putra Malaysia",
    logo: "/upm-logo.png",
    url: "https://www.upm.edu.my",
    desc: "A leading research university in Malaysia, committed to advancing knowledge across agriculture, engineering, environmental sciences, and sustainable development.",
    country: "Malaysia",
  },
  {
    name: "Northumbria University Newcastle",
    logo: "/northumbria-logo.jpg",
    url: "https://www.northumbria.ac.uk",
    desc: "A globally recognised university based in Newcastle upon Tyne, UK, with internationally leading research in environmental science, sustainability, and public health.",
    country: "United Kingdom",
  },
];

const PARTNERS = [
  { name: "Asian Institute of Technology", url: "https://www.ait.ac.th" },
  { name: "WHO Collaborating Centre", url: undefined },
  { name: "ASEAN Clean Air Network", url: undefined },
  { name: "Malaysian Meteorological Dept.", url: "https://www.met.gov.my" },
];

type Sponsor = { tier: "Gold" | "Silver" | "Bronze"; name: string; logo?: string; url?: string };
const SPONSORS: Sponsor[] = [
  { tier: "Gold", name: "Particles Plus", logo: "/particles-plus-logo.png", url: "https://www.particlesplus.com" },
  { tier: "Gold", name: "GreenFleet Maritime" },
  { tier: "Silver", name: "EcoMonitor Asia" },
  { tier: "Silver", name: "Petronas Research" },
  { tier: "Bronze", name: "Clean Air Coalition" },
  { tier: "Bronze", name: "AirLink Sensors" },
];

const TIER_STYLE: Record<string, { badge: string; border: string; gradient: string }> = {
  Gold: {
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
    gradient: "from-amber-400 to-yellow-500",
  },
  Silver: {
    badge: "bg-slate-100 text-slate-700",
    border: "border-slate-200",
    gradient: "from-slate-300 to-slate-500",
  },
  Bronze: {
    badge: "bg-orange-100 text-orange-800",
    border: "border-orange-200",
    gradient: "from-orange-400 to-amber-600",
  },
};

export default function Organizer() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-cyan-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src={logoUrl} alt="Particles Without Borders" className="h-12 w-auto" />
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-sm gradient-text">Particles Without Borders</div>
              <div className="text-[10px] text-muted-foreground tracking-wide uppercase">KLCC · 16 Nov 2026</div>
            </div>
          </Link>
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Behind the Conference</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-5">
            Organisers, Partners<br className="hidden sm:block" /> &amp; <span className="gradient-text">Sponsors</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Particles Without Borders 2026 is made possible through the collaboration of leading institutions and industry partners dedicated to advancing air quality science globally.
          </p>
        </div>
      </section>

      {/* Main Organizers */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-cyan-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Main Organisers</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">Organising Institutions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {MAIN_ORGANIZERS.map((org) => (
              <a
                key={org.name}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-8 rounded-2xl border-2 border-cyan-100 bg-gradient-to-br from-white to-cyan-50/40 shadow-sm hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all"
              >
                <div className="h-40 flex items-center justify-center mb-6 bg-slate-50 rounded-xl border border-cyan-100 p-4">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl mb-1">{org.name}</div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-3">{org.country}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{org.desc}</p>
                </div>
                <div className="mt-5 text-sm font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit website →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Supporting Partners</div>
          <h2 className="text-3xl font-bold mb-10">Partners</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PARTNERS.map((p, i) => {
              const inner = (
                <div className="text-center font-semibold text-sm text-foreground/80 leading-snug">{p.name}</div>
              );
              const cls =
                "group flex items-center justify-center p-6 rounded-2xl bg-white border-2 border-cyan-100 shadow-sm min-h-[120px] hover:shadow-md hover:border-primary/50 transition-all";
              return p.url ? (
                <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className={cls}>
                  <div className="text-center">
                    {inner}
                    <div className="mt-2 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Visit →</div>
                  </div>
                </a>
              ) : (
                <div key={i} className={cls}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-16 px-4 sm:px-6 bg-white border-t border-cyan-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Sponsors</div>
          <h2 className="text-3xl font-bold mb-10">Conference Sponsors</h2>

          {(["Gold", "Silver", "Bronze"] as const).map((tier) => {
            const tierSponsors = SPONSORS.filter((s) => s.tier === tier);
            const style = TIER_STYLE[tier];
            return (
              <div key={tier} className="mb-10">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-5 ${style.badge}`}>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${style.gradient}`} />
                  {tier} Sponsor{tierSponsors.length > 1 ? "s" : ""}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tierSponsors.map((s, i) => {
                    const inner = (
                      <>
                        {s.logo ? (
                          <div className="h-16 flex items-center justify-start mb-4">
                            <img src={s.logo} alt={s.name} className="max-h-full max-w-[140px] object-contain" />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white font-extrabold text-lg shadow mb-4`}>
                            {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </div>
                        )}
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${style.badge.split(" ")[1]}`}>{tier} Sponsor</div>
                        <div className="font-bold text-lg">{s.name}</div>
                        {s.url && (
                          <div className="mt-2 text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Visit website →</div>
                        )}
                      </>
                    );
                    const cls = `group p-6 rounded-2xl bg-white border-2 ${style.border} shadow-sm flex flex-col transition-all`;
                    return s.url ? (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:shadow-xl hover:-translate-y-0.5 hover:border-primary`}>{inner}</a>
                    ) : (
                      <div key={i} className={cls}>{inner}</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Become a sponsor CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Become a Sponsor or Partner</h2>
          <p className="opacity-90 mb-6">
            Join the growing list of organisations powering the conversation on air quality and sustainable solutions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/sponsorship"
              className="inline-block px-8 py-3.5 rounded-full bg-white text-primary font-semibold shadow-xl hover:-translate-y-0.5 transition"
            >
              View Sponsorship Packages
            </Link>
            <a
              href="mailto:secretariat@particleswithoutborders.com?subject=Sponsorship%20Enquiry"
              className="inline-block px-8 py-3.5 rounded-full bg-white/20 border border-white/40 text-white font-semibold hover:bg-white/30 hover:-translate-y-0.5 transition"
            >
              Contact Secretariat
            </a>
          </div>
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
