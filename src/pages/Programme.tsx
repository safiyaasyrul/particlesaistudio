import { useState } from "react";
import { Link } from "wouter";

const logoUrl = "/logo.png";

type SessionType = "plenary" | "keynote" | "break" | "parallel" | "poster" | "ceremony";

type Session = {
  time: string;
  end: string;
  title: string;
  speaker?: string;
  affiliation?: string;
  type: SessionType;
  room?: string;
  chair?: string;
  abstract?: string;
};

const PROGRAMME: Session[] = [
  {
    time: "08:00",
    end: "09:00",
    title: "Registration & Welcome Coffee",
    type: "break",
    room: "Foyer, Level 2",
  },
  {
    time: "09:00",
    end: "09:30",
    title: "Opening Ceremony & Welcome Address",
    type: "ceremony",
    room: "Plenary Hall",
    speaker: "Conference Chair",
    abstract:
      "Official welcome from the organising committee, host institutions, and keynote introduction.",
  },
  {
    time: "09:30",
    end: "10:15",
    title: "Keynote I — Global Air Quality Challenges and the Role of Advanced Particle Monitoring",
    type: "keynote",
    speaker: "TBC",
    affiliation: "Particles Plus, USA",
    room: "Plenary Hall",
    chair: "Conference Chair",
    abstract:
      "An overview of emerging air quality threats worldwide, with a focus on how state-of-the-art particle monitoring technologies are shaping policy and public health responses.",
  },
  {
    time: "10:15",
    end: "11:00",
    title: "Keynote II — Airborne Particulates and Urban Health: Lessons from Southeast Asia",
    type: "keynote",
    speaker: "TBC",
    affiliation: "Universiti Putra Malaysia",
    room: "Plenary Hall",
    chair: "Conference Chair",
    abstract:
      "Drawing on long-term monitoring datasets across Malaysian cities, this keynote examines the epidemiological link between PM2.5 exposure and respiratory health outcomes in tropical urban environments.",
  },
  {
    time: "11:00",
    end: "11:15",
    title: "Morning Coffee Break & Exhibition",
    type: "break",
    room: "Foyer, Level 2",
  },
  {
    time: "11:15",
    end: "11:55",
    title: "Keynote III — Microplastics in the Atmosphere: Detection, Transport and Deposition",
    type: "keynote",
    speaker: "TBC",
    affiliation: "Northumbria University Newcastle, UK",
    room: "Plenary Hall",
    chair: "TBC",
    abstract:
      "This keynote presents cutting-edge findings on atmospheric microplastic concentrations, long-range transport pathways, and innovative detection methodologies developed in partnership with European environmental agencies.",
  },
  {
    time: "11:55",
    end: "13:00",
    title: "Parallel Technical Sessions — Block A",
    type: "parallel",
    room: "Rooms 1 & 2, Level 3",
    abstract:
      "Theme A1: Exposure Assessment & Health Risk (Room 1) · Theme A2: Indoor Air Quality Technologies (Room 2)",
  },
  {
    time: "13:00",
    end: "14:00",
    title: "Networking Lunch",
    type: "break",
    room: "Banquet Hall, Level 2",
  },
  {
    time: "14:00",
    end: "14:40",
    title: "Plenary — Smart Sensors and AI-Driven Air Quality Modelling",
    type: "plenary",
    speaker: "TBC",
    affiliation: "Asian Institute of Technology, Thailand",
    room: "Plenary Hall",
    chair: "TBC",
    abstract:
      "An exploration of how machine learning algorithms, IoT sensor networks and remote sensing platforms are converging to deliver real-time, city-scale air quality predictions.",
  },
  {
    time: "14:40",
    end: "15:20",
    title: "Plenary — Marine Emissions and Transboundary Air Pollution in ASEAN Waters",
    type: "plenary",
    speaker: "TBC",
    affiliation: "GreenFleet Maritime",
    room: "Plenary Hall",
    chair: "TBC",
    abstract:
      "A case-study presentation on ship emission inventories, fuel switching impacts and monitoring strategies for maritime corridors in the Strait of Malacca.",
  },
  {
    time: "15:20",
    end: "15:35",
    title: "Afternoon Coffee Break & Poster Viewing",
    type: "break",
    room: "Foyer, Level 2",
  },
  {
    time: "15:35",
    end: "16:30",
    title: "Parallel Technical Sessions — Block B",
    type: "parallel",
    room: "Rooms 1, 2 & 3, Level 3",
    abstract:
      "Theme B1: Aerosols & Emerging Contaminants (Room 1) · Theme B2: Remote Sensing & Modelling (Room 2) · Theme B3: Source Characterisation (Room 3)",
  },
  {
    time: "16:30",
    end: "17:00",
    title: "Poster Session & Award Judging",
    type: "poster",
    room: "Foyer, Level 2",
    abstract:
      "Presenters stand by their posters for discussion. Best Poster Award judging takes place during this session.",
  },
  {
    time: "17:00",
    end: "17:30",
    title: "Closing Ceremony, Awards & Announcements",
    type: "ceremony",
    room: "Plenary Hall",
    abstract:
      "Best Paper Award, Best Poster Award, and Best Student Paper Award presentations, followed by closing remarks and announcement of future conference editions.",
  },
  {
    time: "19:00",
    end: "21:30",
    title: "Networking Dinner (ticketed)",
    type: "break",
    room: "Skyline Ballroom, KLCC",
    abstract:
      "An exclusive evening reception for all registered delegates. Dress code: Smart casual.",
  },
];

const TYPE_CONFIG: Record<
  SessionType,
  { label: string; color: string; dot: string; bg: string }
> = {
  keynote: {
    label: "Keynote",
    color: "text-amber-700",
    dot: "bg-amber-400",
    bg: "bg-amber-50 border-amber-200",
  },
  plenary: {
    label: "Plenary",
    color: "text-primary",
    dot: "bg-primary",
    bg: "bg-cyan-50 border-cyan-200",
  },
  parallel: {
    label: "Parallel Sessions",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
  },
  poster: {
    label: "Poster",
    color: "text-purple-700",
    dot: "bg-purple-500",
    bg: "bg-purple-50 border-purple-200",
  },
  break: {
    label: "Break / Social",
    color: "text-slate-500",
    dot: "bg-slate-300",
    bg: "bg-slate-50 border-slate-200",
  },
  ceremony: {
    label: "Ceremony",
    color: "text-rose-700",
    dot: "bg-rose-400",
    bg: "bg-rose-50 border-rose-200",
  },
};

const LEGEND_TYPES: SessionType[] = [
  "keynote",
  "plenary",
  "parallel",
  "poster",
  "ceremony",
  "break",
];

function SessionCard({ s, index }: { s: Session; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_CONFIG[s.type];
  const isBreak = s.type === "break";

  if (isBreak) {
    return (
      <div className="flex items-center gap-4 py-3">
        <div className="w-20 flex-shrink-0 text-right text-xs font-mono text-muted-foreground">
          {s.time}
        </div>
        <div className="w-px self-stretch bg-slate-200 flex-shrink-0 relative">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
        </div>
        <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-lg">
            {s.title.includes("Coffee") ? "☕" : s.title.includes("Lunch") ? "🍽️" : s.title.includes("Dinner") ? "🥂" : s.title.includes("Poster") ? "📋" : "⏸️"}
          </span>
          <div>
            <div className="font-medium text-sm text-slate-600">{s.title}</div>
            {s.room && <div className="text-xs text-muted-foreground">{s.room}</div>}
          </div>
          <div className="ml-auto text-xs text-muted-foreground font-mono">{s.time}–{s.end}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-20 flex-shrink-0 text-right pt-4">
        <span className="text-sm font-mono font-semibold text-foreground">{s.time}</span>
        <div className="text-xs text-muted-foreground font-mono">–{s.end}</div>
      </div>
      <div className="w-px self-stretch bg-slate-200 flex-shrink-0 relative mt-2">
        <div className={`absolute -left-1.5 top-4 w-3 h-3 rounded-full border-2 border-white shadow ${cfg.dot}`} />
      </div>
      <div
        className={`flex-1 mb-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${cfg.bg} hover:shadow-md`}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${cfg.color}`}>
              {cfg.label}
            </div>
            <div className="font-bold text-base sm:text-lg leading-snug">{s.title}</div>
            {s.speaker && (
              <div className="mt-1.5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{s.speaker}</span>
                {s.affiliation && <span> · {s.affiliation}</span>}
              </div>
            )}
            {s.room && (
              <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {s.room}
                {s.chair && <span className="ml-2">· Chair: {s.chair}</span>}
              </div>
            )}
          </div>
          <button className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform ${expanded ? "rotate-180" : ""} bg-white/70 border border-current/20`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {expanded && s.abstract && (
          <div className="mt-3 pt-3 border-t border-current/10 text-sm text-muted-foreground leading-relaxed">
            {s.abstract}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Programme() {
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
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">16 November 2026</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-5">
            Conference <span className="gradient-text">Programme</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
            A full day of keynotes, plenary talks, parallel technical sessions and networking — all at the Kuala Lumpur Convention Centre.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Keynote Speakers", value: "3" },
              { label: "Plenary Sessions", value: "2" },
              { label: "Parallel Tracks", value: "5" },
              { label: "Poster Presentations", value: "30+" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-cyan-100 shadow-sm px-6 py-4 text-center">
                <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="px-4 sm:px-6 pb-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3">
          {LEGEND_TYPES.map((t) => {
            const cfg = TYPE_CONFIG[t];
            return (
              <div key={t} className="flex items-center gap-1.5 text-xs font-semibold">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className={cfg.color}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-cyan-100 shadow-sm p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-cyan-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-lg">Sunday, 16 November 2026</div>
                <div className="text-sm text-muted-foreground">Kuala Lumpur Convention Centre (KLCC)</div>
              </div>
            </div>

            <div className="space-y-0">
              {PROGRAMME.map((s, i) => (
                <SessionCard key={i} s={s} index={i} />
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800 flex gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Programme subject to change.</strong> Speaker names marked TBC will be updated as confirmations are received. Click any session to expand its description. Final proceedings will be distributed in the conference kit.
            </span>
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
