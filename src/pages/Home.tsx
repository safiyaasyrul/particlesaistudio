import { useState, useEffect } from "react";
import { Link } from "wouter";
import klccBg from "@assets/PWB_BG_1777859070413.png";

const logoUrl = "/logo.png";
const particlesPlusLogo = "/particles-plus-logo.png";
const upmLogo = "/upm-logo.png";
const northumbriaLogo = "/northumbria-logo.jpg";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "papers", label: "Call for Papers" },
  { id: "dates", label: "Important Dates" },
  { id: "registration", label: "Registration" },
  { id: "organizers", label: "Organizers" },
  { id: "sponsors", label: "Sponsors" },
];

const THEMES = [
  "Exposure Assessment and Health Risk Evaluation Based on Advanced Air Quality Measurements",
  "Indoor Air Quality Monitoring Technologies and Human Health Implications",
  "Measurement and Monitoring of Aerosols, Microplastics, and Emerging Airborne Contaminants",
  "Smart Sensors, Big Data Analytics, Air Quality Modelling, and Remote Sensing Applications",
  "Characterisation of Air Pollution Sources and Emissions Using Advanced Monitoring Technologies",
];

type Organizer = { role: string; name: string; logo: string; url: string };
const ORGANIZERS: Organizer[] = [
  { role: "Lead Organiser", name: "Particles Plus", logo: particlesPlusLogo, url: "https://www.particlesplus.com" },
  { role: "Academic Co-Organiser", name: "Universiti Putra Malaysia", logo: upmLogo, url: "https://www.upm.edu.my" },
  { role: "Research Co-Organiser", name: "Northumbria University Newcastle", logo: northumbriaLogo, url: "https://www.northumbria.ac.uk" },
];

type Sponsor = { tier: string; name: string; logo?: string; url?: string };
const SPONSORS: Sponsor[] = [
  { tier: "Gold", name: "GreenFleet Maritime" },
  { tier: "Silver", name: "EcoMonitor Asia" },
  { tier: "Silver", name: "Petronas Research" },
  { tier: "Bronze", name: "Clean Air Coalition" },
  { tier: "Bronze", name: "AirLink Sensors" },
];

type Partner = { name: string; logo?: string; url?: string };
const PARTNERS: Partner[] = [
  { name: "Asian Institute of Technology" },
  { name: "WHO Collaborating Centre" },
  { name: "ASEAN Clean Air Network" },
  { name: "Malaysian Meteorological Dept." },
];

const TOPICS = [
  { title: "Exposure Assessment and Health Risk Evaluation Based on Advanced Air Quality Measurements", desc: "Assessing human exposure to air pollution and related health risks using advanced monitoring methods." },
  { title: "Indoor Air Quality Monitoring Technologies and Human Health Implications", desc: "Monitoring indoor air pollution and understanding its effects on human health and wellbeing." },
  { title: "Measurement and Monitoring of Aerosols, Microplastics, and Emerging Airborne Contaminants", desc: "Studying airborne particles and emerging pollutants and their impact on environment and health." },
  { title: "Smart Sensors, Big Data Analytics, Air Quality Modelling, and Remote Sensing Applications", desc: "Using sensors, data analytics, and modelling tools to monitor and predict air quality." },
  { title: "Characterisation of Air Pollution Sources and Emissions Using Advanced Monitoring Technologies", desc: "Identifying pollution sources and emissions using advanced monitoring and analysis techniques." },
];

const DATES = [
  { date: "30 Jun 2026", label: "Abstract Submission Opens" },
  { date: "31 Aug 2026", label: "Abstract Submission Deadline" },
  { date: "15 Sep 2026", label: "Notification of Acceptance" },
  { date: "30 Sep 2026", label: "Early Bird Registration Deadline" },
  { date: "31 Oct 2026", label: "Final Registration Deadline" },
  { date: "16 Nov 2026", label: "Conference Day — KLCC, Kuala Lumpur" },
];

type Category = "industry" | "academic" | "student";
type Role = "presenter" | "listener";

type CategoryConfig = {
  key: Category;
  name: string;
  icon: string;
  desc: string;
  perks: string[];
  hasListener: boolean;
  presenterFee: { early: string; regular: string };
  listenerFee?: { early: string; regular: string };
  requireUniEmail?: boolean;
};

const CATEGORIES: CategoryConfig[] = [
  {
    key: "industry",
    name: "Industry",
    icon: "🏭",
    desc: "Professionals from industry, government and non-academic organisations.",
    perks: ["Full conference access", "Lunch & coffee breaks", "Conference kit & e-certificate", "Networking dinner"],
    hasListener: true,
    presenterFee: { early: "MYR 400", regular: "MYR 500" },
    listenerFee:  { early: "MYR 320", regular: "MYR 400" },
  },
  {
    key: "academic",
    name: "Academician",
    icon: "🎓",
    desc: "Faculty, researchers and staff of recognised academic or research institutions. Institutional email required.",
    perks: ["Full conference access", "Lunch & coffee breaks", "Conference kit & e-certificate", "Networking dinner", "Publications access"],
    hasListener: true,
    presenterFee: { early: "MYR 200", regular: "MYR 250" },
    listenerFee:  { early: "MYR 160", regular: "MYR 200" },
    requireUniEmail: true,
  },
  {
    key: "student",
    name: "Student",
    icon: "🎒",
    desc: "Full-time students at recognised institutions. Student ID and abstract submission required.",
    perks: ["Full conference access", "Presentation slot", "Publications", "E-certificate", "Lunch & coffee breaks"],
    hasListener: false,
    presenterFee: { early: "MYR 100", regular: "MYR 150" },
  },
];

const FREE_EMAIL_DOMAINS = ["gmail.com","yahoo.com","hotmail.com","outlook.com","live.com","icloud.com","me.com","aol.com","ymail.com","proton.me","protonmail.com"];
function isUniEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return domain.length > 0 && !FREE_EMAIL_DOMAINS.includes(domain);
}

function Particles() {
  const items = Array.from({ length: 70 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((_, i) => {
        const size = 3 + Math.random() * 16;
        const left = Math.random() * 100;
        const dur = 6 + Math.random() * 12;
        const delay = Math.random() * 2;
        const drift = (Math.random() * 60 - 30).toFixed(1);
        const opacity = 0.35 + Math.random() * 0.55;
        const blur = Math.random() < 0.3 ? "blur(1px)" : "none";
        return (
          <span
            key={i}
            className="particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-${size}px`,
              opacity,
              filter: blur,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              ["--drift" as any]: `${drift}px`,
            }}
          />
        );
      })}
    </div>
  );
}

function Header({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-cyan-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="flex items-center gap-3">
          <img src={logoUrl} alt="Particles Without Borders" className="h-12 w-auto" />
          <div className="hidden sm:block leading-tight">
            <div className="font-bold text-sm gradient-text">Particles Without Borders</div>
            <div className="text-[10px] text-muted-foreground tracking-wide uppercase">KLCC · 16 Nov 2026</div>
          </div>
        </button>
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => onNav(n.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                active === n.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-cyan-50"
              }`}
            >
              {n.label}
            </button>
          ))}
         
          <Link href="/programme" className="px-3 py-2 rounded-full text-sm font-medium text-foreground hover:bg-cyan-50">
            Programme
          </Link>
          <Link href="/sponsorship" className="px-3 py-2 rounded-full text-sm font-medium text-foreground hover:bg-cyan-50">
            Sponsorship
          </Link>
        </nav>
        <button className="lg:hidden p-2 rounded-md hover:bg-cyan-50" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <div className="w-6 h-0.5 bg-foreground mb-1.5" />
          <div className="w-6 h-0.5 bg-foreground mb-1.5" />
          <div className="w-6 h-0.5 bg-foreground" />
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-cyan-100 px-4 py-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => { onNav(n.id); setOpen(false); }} className="text-left px-4 py-2 rounded-md hover:bg-cyan-50 text-sm font-medium">
              {n.label}
            </button>
          ))}
          
          <Link href="/programme" className="text-left px-4 py-2 rounded-md hover:bg-cyan-50 text-sm font-medium" onClick={() => setOpen(false)}>
            Programme
          </Link>
          <Link href="/sponsorship" className="text-left px-4 py-2 rounded-md hover:bg-cyan-50 text-sm font-medium" onClick={() => setOpen(false)}>
            Sponsorship
          </Link>
        </div>
      )}
    </header>
  );
}

function Hero({ onNav }: { onNav: (id: string) => void }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${klccBg})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-transparent" />
      <Particles />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="fade-in backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-slate-200 text-slate-700 text-xs font-medium uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            16 November 2026 · KLCC, Kuala Lumpur
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-5 tracking-tight">
            Particles<br />
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-transparent">Without Borders</span>
          </h1>
          <p className="text-xl sm:text-2xl font-light italic mb-4 text-slate-700">Air Quality, Health &amp; Sustainable Solutions</p>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
            An international gathering of scientists, engineers and policymakers advancing the understanding of particles, emissions and sustainable solutions for cleaner air and healthier communities.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => onNav("registration")} className="px-7 py-3.5 rounded-full bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-500 hover:-translate-y-0.5 transition-all">Register Now</button>
            <button onClick={() => onNav("registration")} className="px-7 py-3.5 rounded-full border border-slate-300 text-slate-700 bg-white/80 font-semibold shadow-sm hover:bg-white hover:-translate-y-0.5 transition-all">Submit Abstract</button>
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-radial from-white/50 via-white/15 to-transparent blur-3xl" />
          <div className="float-anim bg-white/95 rounded-[2rem] flex items-center justify-center p-6 shadow-2xl border border-white/60">
            <img
              src={logoUrl}
              alt="Particles Without Borders Logo"
              className="block max-w-[320px] w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 sm:py-28 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {kicker && <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">{kicker}</div>}
        <h2 className="text-3xl sm:text-5xl font-bold mb-10 text-foreground">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" kicker="About the Conference" title="Particles Without Borders: Air Quality, Health & Sustainable Solutions">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 text-lg text-muted-foreground leading-relaxed space-y-4">
          <p><strong className="text-foreground">Particles Without Borders</strong> brings together a global community of researchers, industry leaders and policymakers tackling one of the most pressing environmental challenges of our time — airborne particulate matter, its sources, its transport across boundaries and its impact on human and planetary health.</p>
          <p>Hosted at the iconic Kuala Lumpur Convention Centre (KLCC), the 2026 edition explores air pollution, marine emissions, energy systems, nanoparticles and AI modelling — and the sustainable pathways that connect them.</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary text-white p-8 shadow-xl">
          <div className="text-5xl font-extrabold mb-2">300+</div>
          <div className="text-sm uppercase tracking-wider opacity-90 mb-6">Expected Delegates</div>
          <div className="text-3xl font-bold mb-1">25+</div>
          <div className="text-sm uppercase tracking-wider opacity-90 mb-6">Countries Represented</div>
          <div className="text-3xl font-bold mb-1">40+</div>
          <div className="text-sm uppercase tracking-wider opacity-90">Invited Speakers</div>
        </div>
      </div>
    </Section>
  );
}

function CallForPapers() {
  return (
    <Section id="papers" kicker="Call for Papers" title="Conference themes.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((t, i) => (
          <div key={i} className="group p-7 rounded-2xl bg-white border border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mb-4 group-hover:scale-110 transition-transform">{String(i + 1).padStart(2, "0")}</div>
            <h3 className="text-xl font-bold mb-2">{t.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

type RegistrationTab = "fees" | "register";

function ThemeCards({ selectedTheme, setSelectedTheme }: { selectedTheme: string; setSelectedTheme: (t: string) => void }) {
  const icons = ["🫁", "🏠", "🌫️", "📡", "🏭"];
  return (
    <div>
      <label className="text-sm font-semibold mb-1 block">Conference Theme <span className="text-destructive">*</span></label>
      <p className="text-xs text-muted-foreground mb-3">Select the theme that best matches your paper.</p>
      <div className="space-y-2">
        {THEMES.map((theme, i) => {
          const isSelected = selectedTheme === theme;
          return (
            <button type="button" key={i} onClick={() => setSelectedTheme(theme)}
              className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-cyan-100 bg-white hover:border-cyan-300"}`}>
              <span className="text-xl mt-0.5 flex-shrink-0">{icons[i]}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold leading-snug ${isSelected ? "text-primary" : "text-foreground"}`}>Theme {i + 1}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{theme}</div>
              </div>
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${isSelected ? "border-primary bg-primary" : "border-slate-300"}`}>
                {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
            </button>
          );
        })}
      </div>
      <input type="hidden" name="theme" value={selectedTheme} />
      {!selectedTheme && <p className="text-xs text-destructive mt-2">Please select a theme to continue.</p>}
    </div>
  );
}

function Registration() {
  const [tab, setTab] = useState<RegistrationTab>("fees");
  const [initCategory, setInitCategory] = useState<Category>("academic");
  const [initRole, setInitRole] = useState<Role>("presenter");

  function jumpToRegister(cat: Category, role: Role) {
    setInitCategory(cat);
    setInitRole(role);
    setTab("register");
  }

  return (
    <Section id="registration" kicker="Registration & Submission" title="Join us in Kuala Lumpur.">
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-muted rounded-full w-fit">
        {([{ k: "fees", label: "Fees" }, { k: "register", label: "Register" }] as { k: RegistrationTab; label: string }[]).map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${tab === t.k ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "fees" && (
        <div>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Early Bird ends 30 September 2026 — save up to 20%
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className={`relative p-7 rounded-2xl border-2 transition-all flex flex-col ${cat.key === "academic" ? "border-primary bg-gradient-to-br from-cyan-50 to-emerald-50 shadow-2xl scale-[1.02]" : "border-cyan-100 bg-white shadow-sm hover:shadow-lg"}`}>
                {cat.key === "academic" && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">Most popular</div>}
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{cat.desc}</p>

                <div className="space-y-3 mb-5">
                  <div className="p-3 rounded-xl bg-white/70 border border-cyan-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Presenter</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold gradient-text">{cat.presenterFee.early}</span>
                      <span className="text-xs text-muted-foreground">early bird</span>
                    </div>
                    <div className="text-xs text-muted-foreground line-through">{cat.presenterFee.regular} regular</div>
                    <div className="text-xs text-slate-500 mt-1">Submit abstract + choose theme</div>
                  </div>
                  {cat.hasListener && cat.listenerFee && (
                    <div className="p-3 rounded-xl bg-white/70 border border-cyan-100">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Listener</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-emerald-600">{cat.listenerFee.early}</span>
                        <span className="text-xs text-muted-foreground">early bird</span>
                      </div>
                      <div className="text-xs text-muted-foreground line-through">{cat.listenerFee.regular} regular</div>
                      <div className="text-xs text-slate-500 mt-1">Attend sessions, no presentation</div>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 flex-1 mb-5">
                  {cat.perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span>{p}</span>
                    </li>
                  ))}
                  {cat.requireUniEmail && (
                    <li className="flex items-start gap-2 text-sm text-amber-700">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Institutional email required</span>
                    </li>
                  )}
                </ul>

                <div className="space-y-2">
                  <button onClick={() => jumpToRegister(cat.key, "presenter")}
                    className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all ${cat.key === "academic" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-foreground text-background hover:opacity-90"}`}>
                    Register as Presenter
                  </button>
                  {cat.hasListener && (
                    <button onClick={() => jumpToRegister(cat.key, "listener")}
                      className="w-full py-2.5 rounded-full text-sm font-semibold border-2 border-current transition-all hover:bg-slate-50">
                      Register as Listener
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "register" && <RegistrationForm initCategory={initCategory} initRole={initRole} />}
    </Section>
  );
}

function RegistrationForm({ initCategory, initRole }: { initCategory: Category; initRole: Role }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(initCategory);
  const [role, setRole] = useState<Role>(initRole);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [abstractFileName, setAbstractFileName] = useState<string>("");
  const [studentIdFileName, setStudentIdFileName] = useState<string>("");
  const [emailVal, setEmailVal] = useState("");

  const cat = CATEGORIES.find((c) => c.key === category)!;
  const isPresenter = category === "student" || role === "presenter";
  const fee = role === "listener" && cat.listenerFee ? cat.listenerFee : cat.presenterFee;
  const showUniWarning = cat.requireUniEmail && emailVal.length > 3 && !isUniEmail(emailVal);

  function handleCategoryChange(c: Category) {
    setCategory(c);
    const newCat = CATEGORIES.find((x) => x.key === c)!;
    if (!newCat.hasListener) setRole("presenter");
    setSelectedTheme("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPresenter && !selectedTheme) {
      setError("Please select a conference theme for your paper.");
      return;
    }
    if (cat.requireUniEmail && !isUniEmail(emailVal)) {
      setError("Academician registration requires an institutional email address (not Gmail, Yahoo, etc.).");
      return;
    }
    setError(null);
    setSubmitting(true);
    const f = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      category: `${cat.name} — ${isPresenter ? "Presenter" : "Listener"}`,
      name: f.get("name"),
      email: f.get("email"),
      affiliation: f.get("affiliation"),
      country: f.get("country"),
      theme: selectedTheme,
      subRole: isPresenter ? "presenter" : "listener",
      dietary: f.get("dietary") ?? "",
      visa: f.get("visa"),
      reviewer: f.get("reviewer"),
      paymentStatus: "Pending",
    };
    if (isPresenter) {
      payload.paperTitle = f.get("paperTitle");
      payload.keywords = f.get("keywords");
      payload.abstractFile = abstractFileName;
    }
    if (category === "student") payload.studentIdFile = studentIdFileName;
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
     let data;

try {
  data = await res.json();
} catch {
  throw new Error("Server did not return JSON");
}
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      setSavedId(data.registration?.id ?? null);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl bg-white p-8 rounded-2xl border border-cyan-100 shadow-sm space-y-6">
      {submitted ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Registration successful</h3>
          <p className="text-muted-foreground">An invoice and payment instructions will arrive in your inbox shortly.</p>
          <p className="mt-3 text-sm text-emerald-700 font-medium">Your submission is under review. Notification will be sent via email.</p>
          {savedId && <p className="mt-3 text-xs text-muted-foreground font-mono">Reference: {savedId}</p>}
        </div>
      ) : (
        <>
          {/* Step 1: Category */}
          <div>
            <label className="text-sm font-semibold mb-3 block">1. Participant category</label>
            <div className="grid sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button type="button" key={c.key} onClick={() => handleCategoryChange(c.key)}
                  className={`p-4 rounded-xl text-sm font-semibold border-2 transition-all text-left ${category === c.key ? "border-primary bg-primary/5" : "border-cyan-100 hover:border-cyan-300"}`}>
                  <div className="text-xl mb-1">{c.icon}</div>
                  <div>{c.name}</div>
                  <div className="text-xs font-normal text-muted-foreground mt-0.5">{c.presenterFee.early} presenter</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Role (Industry / Academic only) */}
          {cat.hasListener && (
            <div>
              <label className="text-sm font-semibold mb-3 block">2. Attending as</label>
              <div className="grid grid-cols-2 gap-3">
                {(["presenter", "listener"] as Role[]).map((r) => {
                  const roleFee = r === "listener" && cat.listenerFee ? cat.listenerFee : cat.presenterFee;
                  return (
                    <button type="button" key={r} onClick={() => { setRole(r); setSelectedTheme(""); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${role === r ? "border-primary bg-primary/5" : "border-cyan-100 hover:border-cyan-300"}`}>
                      <div className="font-semibold capitalize text-sm">{r}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {r === "presenter" ? "Submit abstract + choose theme" : "Attend sessions, no presentation"}
                      </div>
                      <div className="text-sm font-bold gradient-text mt-1">{roleFee.early} <span className="text-xs font-normal text-muted-foreground">early bird</span></div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Personal details */}
          <div className="space-y-4">
            <label className="text-sm font-semibold block">{cat.hasListener ? "3." : "2."} Your details</label>
            <Field label="Full name" name="name" required />
            <div>
              <label className="text-sm font-semibold mb-2 block" htmlFor="email">
                Email {cat.requireUniEmail && <span className="text-amber-600 font-normal text-xs ml-1">(institutional email required)</span>} <span className="text-destructive">*</span>
              </label>
              <input id="email" name="email" type="email" required value={emailVal} onChange={(e) => setEmailVal(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${showUniWarning ? "border-amber-400 bg-amber-50" : "border-input bg-background"}`} />
              {showUniWarning && (
                <p className="text-xs text-amber-700 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Please use your institutional email (e.g. @upm.edu.my, @northumbria.ac.uk)
                </p>
              )}
            </div>
            <Field label="Affiliation / Institution" name="affiliation" required />
            <Field label="Country" name="country" required />
          </div>

          {/* Student ID upload — always for students */}
          {category === "student" && (
            <div className="p-5 rounded-xl border-2 border-cyan-100 bg-cyan-50/40 space-y-3">
              <label className="text-sm font-semibold block">Student ID verification <span className="text-destructive">*</span></label>
              <p className="text-xs text-muted-foreground">Upload a clear scan or photo of your valid student ID card (PDF / JPG / PNG).</p>
              <input type="file" accept=".pdf,image/*" required onChange={(e) => setStudentIdFileName(e.target.files?.[0]?.name ?? "")}
                className="block w-full text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold hover:file:opacity-90" />
              {studentIdFileName && <p className="text-xs text-emerald-600 font-medium">✓ Selected: {studentIdFileName}</p>}
            </div>
          )}

          {/* Presenter fields — shown when presenting */}
          {isPresenter && (
            <div className="p-5 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span className="text-sm font-bold">Abstract submission</span>
              </div>
              <ThemeCards selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
              <Field label="Paper title" name="paperTitle" required />
              <Field label="Keywords (comma separated)" name="keywords" required />
              <div>
                <label className="text-sm font-semibold mb-2 block">Abstract upload (PDF / DOC / DOCX) <span className="text-destructive">*</span></label>
                <input type="file" accept=".pdf,.doc,.docx" required onChange={(e) => setAbstractFileName(e.target.files?.[0]?.name ?? "")}
                  className="block w-full text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold hover:file:opacity-90" />
                {abstractFileName && <p className="text-xs text-emerald-600 font-medium mt-1.5">✓ Selected: {abstractFileName}</p>}
              </div>
            </div>
          )}

          {/* Other fields */}
          <div className="space-y-4">
            <Field label="Dietary Requirements" name="dietary" placeholder="e.g. vegetarian, halal, allergies" />
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="Visa invitation letter required?" name="visa" required options={["No", "Yes"]} />
              <SelectField label="Willing to be a reviewer?" name="reviewer" required options={["No", "Yes"]} />
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-emerald-50 border border-cyan-200 text-sm flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-bold">{cat.name} — {isPresenter ? "Presenter" : "Listener"}</div>
              <div className="text-muted-foreground text-xs mt-0.5">Early Bird deadline: 30 September 2026</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold gradient-text">{fee.early}</div>
              <div className="text-xs text-muted-foreground line-through">{fee.regular} regular</div>
            </div>
          </div>

          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {submitting ? "Submitting…" : "Complete Registration"}
          </button>
        </>
      )}
    </form>
  );
}

function SelectField({ label, name, required, options }: { label: string; name: string; required?: boolean; options: string[] }) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block" htmlFor={name}>{label} {required && <span className="text-destructive">*</span>}</label>
      <select id={name} name={name} required={required} defaultValue="" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
        <option value="" disabled>Select…</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block" htmlFor={name}>{label} {required && <span className="text-destructive">*</span>}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" />
    </div>
  );
}
function Organizers() {
  return (
    <Section id="organizers" kicker="Organised By" title="Meet the organizers.">
      <div className="grid sm:grid-cols-3 gap-6">
        {ORGANIZERS.map((o, i) => {
          const card = (
            <div className="group bg-white p-8 rounded-2xl border border-cyan-100 shadow-sm flex flex-col items-center text-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-48 h-32 rounded-2xl bg-slate-50 border border-cyan-100 flex items-center justify-center p-4 shadow-sm">
                {o.logo
                  ? <img src={o.logo} alt={o.name} className="max-h-full max-w-full object-contain" />
                  : <span className="text-2xl font-bold text-primary">{o.name.split(" ").map(w => w[0]).join("").slice(0, 3)}</span>
                }
              </div>
              <div>
                <div className="font-bold text-lg mb-1">{o.name}</div>
                <div className="text-sm text-muted-foreground">{o.role}</div>
              </div>
              {o.url && (
                <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit website →
                </div>
              )}
            </div>
          );
          return o.url
            ? <a key={i} href={o.url} target="_blank" rel="noopener noreferrer" className="block">{card}</a>
            : <div key={i}>{card}</div>;
        })}
      </div>
    </Section>
  );
}
function Sponsors() {
  const tierClass: Record<string, string> = {
    Gold: "from-amber-400 to-yellow-500",
    Silver: "from-slate-300 to-slate-400",
    Bronze: "from-orange-400 to-amber-600",
  };
  return (
    <Section id="sponsors" kicker="Sponsors & Partners" title="Powering the conversation.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {SPONSORS.map((s, i) => {
          const inner = (
            <>
              {s.logo ? (
                <div className="w-16 h-16 rounded-xl bg-white border border-cyan-100 flex items-center justify-center p-1.5 shadow">
                  <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tierClass[s.tier]} flex items-center justify-center text-white font-extrabold text-lg shadow`}>
                  {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
              )}
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{s.tier} Sponsor</div>
                <div className="font-bold">{s.name}</div>
                {s.url && (
                  <div className="text-xs text-primary mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Visit website →
                  </div>
                )}
              </div>
            </>
          );
          const cardClass =
            "group bg-white p-6 rounded-2xl border border-cyan-100 shadow-sm flex items-center gap-4 transition-all";
          return s.url ? (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visit ${s.name}`}
              className={`${cardClass} hover:shadow-xl hover:-translate-y-0.5 hover:border-primary cursor-pointer`}
            >
              {inner}
            </a>
          ) : (
            <div key={i} className={cardClass}>{inner}</div>
          );
        })}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-5">Partners</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PARTNERS.map((p, i) => {
            const body = p.logo ? (
              <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
            ) : (
              p.name
            );
            const cls =
              "aspect-[3/2] bg-white border border-cyan-100 rounded-xl shadow-sm flex items-center justify-center p-4 text-center text-sm font-semibold text-foreground/80 hover:shadow-md hover:border-primary transition";
            return p.url ? (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" title={`Visit ${p.name}`} className={cls}>
                {body}
              </a>
            ) : (
              <div key={i} className={cls} title={p.name}>{body}</div>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <Link href="/sponsorship" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90">
          View sponsorship opportunities →
        </Link>
      </div>
    </Section>
  );
}

function Dates() {
  return (
    <Section id="dates" kicker="Important Dates" title="Mark your calendar.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DATES.map((d, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${i === DATES.length - 1 ? "bg-gradient-to-br from-primary to-secondary text-white border-transparent" : "bg-white border-cyan-100"} shadow-sm`}>
            <div className={`text-xs uppercase tracking-wider font-semibold mb-2 ${i === DATES.length - 1 ? "opacity-90" : "text-primary"}`}>{d.date}</div>
            <div className={`font-semibold ${i === DATES.length - 1 ? "text-white" : "text-foreground"}`}>{d.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" kicker="Contact" title="Get in touch with the secretariat.">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-cyan-100 shadow-sm space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Email</div>
            <a href="mailto:secretariat@particleswithoutborders.com" className="text-lg font-semibold hover:underline">secretariat@particleswithoutborders.com</a>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Venue</div>
            <div className="text-lg font-semibold">Kuala Lumpur Convention Centre (KLCC)</div>
            <div className="text-muted-foreground">Jalan Pinang, 50088 Kuala Lumpur, Malaysia</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Date</div>
            <div className="text-lg font-semibold">16 November 2026</div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-cyan-100 shadow-sm min-h-[280px]">
          <iframe title="KLCC location" src="https://www.openstreetmap.org/export/embed.html?bbox=101.7080%2C3.1500%2C101.7220%2C3.1620&layer=mapnik&marker=3.1560%2C101.7150" className="w-full h-full min-h-[280px] border-0" />
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-cyan-950 to-emerald-950 text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="logo" className="h-12 w-auto bg-white/95 rounded-lg p-1" />
          <div>
            <div className="font-bold">Particles Without Borders</div>
            <div className="text-xs text-cyan-200/80">Air Quality, Health &amp; Sustainable Solutions</div>
          </div>
        </div>
        <div className="text-sm text-cyan-200/70 text-center md:text-right">© 2026 Particles Without Borders · KLCC, Kuala Lumpur</div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
      const y = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= y) {
          setActive(sections[i].id);
          return;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-cyan-50">
      <Header active={active} onNav={handleNav} />
      <main>
        <Hero onNav={handleNav} />
        <About />
        <CallForPapers />
         <Dates />
        <Registration />
        <Organizers />
        <Sponsors />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
