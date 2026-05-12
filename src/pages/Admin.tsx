import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

const logoUrl = "/logo.png";

type Reg = {
  id: string;
  category: string;
  name: string;
  email: string;
  affiliation: string;
  country: string;
  theme: string;
  sub_role: string;
  paper_title: string;
  keywords: string;
  dietary: string;
  visa: string;
  reviewer: string;
  payment_status: string;
  review_status: string;
  status: string;
  invoice_sent: boolean;
  decision_sent: boolean;
  created_at: string;
};

type EmailPreview = { subject: string; html: string } | null;

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  Pending:  { label: "Pending",  bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400" },
  Accepted: { label: "Accepted", bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500" },
  Rejected: { label: "Rejected", bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-400" },
};

function Badge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function EmailModal({ preview, onClose }: { preview: EmailPreview; onClose: () => void }) {
  if (!preview) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">Email sent</div>
            <div className="font-bold text-sm">{preview.subject}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-muted-foreground mb-3 font-mono break-all">
            <strong>Subject:</strong> {preview.subject}
          </div>
          <iframe
            srcDoc={preview.html}
            className="w-full rounded-xl border"
            style={{ height: 480 }}
            title="Email preview"
          />
        </div>
        <div className="px-6 pb-4 flex gap-2 justify-end">
          <button
            onClick={() => navigator.clipboard.writeText(preview.html)}
            className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50"
          >
            Copy HTML
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RowActions({
  reg,
  token,
  onUpdate,
  onPreview,
}: {
  reg: Reg;
  token: string;
  onUpdate: () => void;
  onPreview: (p: EmailPreview) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const isPresenter = reg.sub_role === "presenter" && reg.paper_title;

  async function callApi(path: string, body: object) {
    setLoading(path);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      onPreview(data.emailContent ?? null);
      onUpdate();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 justify-end">
      <button
        disabled={!!loading}
        onClick={() => callApi(`/api/admin/registrations/${reg.id}/decision`, { decision: "Accepted" })}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors"
      >
        {loading === `/api/admin/registrations/${reg.id}/decision` ? "…" : "Accept Paper"}
      </button>
      <button
        disabled={!!loading}
        onClick={() => callApi(`/api/admin/registrations/${reg.id}/decision`, { decision: "Rejected" })}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
      >
        {loading ? "…" : "Reject Paper"}
      </button>
      <button
        disabled={!!loading}
        onClick={() => {
          const subject = prompt("Custom email subject");
          const message = prompt("Custom email message");
          if (!subject || !message) return;
          callApi(`/api/admin/registrations/${reg.id}/custom-email`, { subject, message });
        }}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
      >
        Send Custom Email
      </button>
      <button
        disabled={!!loading}
        onClick={() => callApi(`/api/admin/registrations/${reg.id}/invoice`, {})}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
          reg.invoice_sent
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        }`}
      >
        {loading === `/api/admin/registrations/${reg.id}/invoice`
          ? "…"
          : reg.invoice_sent
          ? "Resend Invoice"
          : "Send Invoice"}
      </button>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-cyan-100 shadow-sm px-6 py-5">
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("pwb_admin_token") ?? "");
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "Pending" | "Accepted" | "Rejected">("all");
  const [search, setSearch] = useState("");
  const [emailPreview, setEmailPreview] = useState<EmailPreview>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchRegs = useCallback(async (tok: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) {
        setLoggedIn(false);
        sessionStorage.removeItem("pwb_admin_token");
        setToken("");
        setLoginError("Incorrect password.");
        return;
      }
      const data = await res.json();
      setRegistrations(data.registrations ?? []);
      setLoggedIn(true);
    } catch {
      setLoginError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchRegs(token);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    sessionStorage.setItem("pwb_admin_token", loginInput);
    setToken(loginInput);
    await fetchRegs(loginInput);
  }

  const filtered = registrations.filter((r) => {
    if (filter !== "all" && r.review_status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || (r.paper_title ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: registrations.length,
    pending: registrations.filter((r) => r.review_status === "Pending").length,
    accepted: registrations.filter((r) => r.review_status === "Accepted").length,
    rejected: registrations.filter((r) => r.review_status === "Rejected").length,
    invoiced: registrations.filter((r) => r.invoice_sent).length,
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logoUrl} alt="PWB" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Particles Without Borders 2026</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-cyan-100 shadow-lg p-8 space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block" htmlFor="password">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter admin password"
              />
              {loginError && <p className="text-xs text-destructive mt-2">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <EmailModal preview={emailPreview} onClose={() => setEmailPreview(null)} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="PWB" className="h-9 w-auto" />
          <div>
            <div className="font-bold text-sm gradient-text">Admin Dashboard</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Particles Without Borders 2026</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Public site
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("pwb_admin_token");
              setLoggedIn(false);
              setToken("");
              setRegistrations([]);
            }}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard label="Total Registrations" value={counts.all} color="gradient-text" />
          <StatCard label="Pending Review" value={counts.pending} color="text-amber-600" />
          <StatCard label="Accepted" value={counts.accepted} color="text-emerald-600" />
          <StatCard label="Rejected" value={counts.rejected} color="text-red-500" />
          <StatCard label="Invoices Sent" value={counts.invoiced} color="text-primary" />
        </div>

        {/* SMTP notice */}
        {!loading && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 flex gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Emails are sent via SMTP. Set <code className="bg-amber-100 px-1 rounded">SMTP_HOST</code>, <code className="bg-amber-100 px-1 rounded">SMTP_USER</code>, <code className="bg-amber-100 px-1 rounded">SMTP_PASS</code> and <code className="bg-amber-100 px-1 rounded">SMTP_FROM</code> environment variables to enable live sending.
              Until then, clicking send will still show you a full preview of the email that would be sent.
            </span>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {(["all", "Pending", "Accepted", "Rejected"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                    filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-slate-100"
                  }`}
                >
                  {f} {f === "all" ? `(${counts.all})` : f === "Pending" ? `(${counts.pending})` : f === "Accepted" ? `(${counts.accepted})` : `(${counts.rejected})`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search name, email, ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                />
              </div>
              <button
                onClick={() => fetchRegs(token)}
                disabled={loading}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">
              <svg className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading registrations…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <div className="text-4xl mb-3">📭</div>
              <div className="font-semibold">No registrations found</div>
              <div className="text-sm mt-1">{search ? "Try a different search." : "Registrations will appear here once submitted."}</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Delegate</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Abstract</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Review Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Invoice</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((reg) => (
                    <>
                      <tr
                        key={reg.id}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{reg.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-semibold">{reg.name}</div>
                          <div className="text-xs text-muted-foreground">{reg.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          <div className="text-xs">{reg.category}</div>
                          {reg.sub_role && <div className="text-xs text-muted-foreground capitalize">{reg.sub_role}</div>}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                          {reg.paper_title ? (
                            <div className="text-xs truncate max-w-[200px]" title={reg.paper_title}>{reg.paper_title}</div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge status={reg.review_status || "Pending"} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                          {reg.invoice_sent ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Sent
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not sent</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <RowActions
                            reg={reg}
                            token={token}
                            onUpdate={() => fetchRegs(token)}
                            onPreview={setEmailPreview}
                          />
                        </td>
                      </tr>
                      {expandedId === reg.id && (
                        <tr key={`${reg.id}-expanded`} className="bg-slate-50/80">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personal</div>
                                <div><span className="text-muted-foreground">Affiliation:</span> {reg.affiliation || "—"}</div>
                                <div><span className="text-muted-foreground">Country:</span> {reg.country || "—"}</div>
                                <div><span className="text-muted-foreground">Dietary:</span> {reg.dietary || "None"}</div>
                                <div><span className="text-muted-foreground">Visa needed:</span> {reg.visa || "—"}</div>
                                <div><span className="text-muted-foreground">Reviewer:</span> {reg.reviewer || "—"}</div>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Submission</div>
                                <div><span className="text-muted-foreground">Theme:</span> {reg.theme || "—"}</div>
                                <div><span className="text-muted-foreground">Paper title:</span> {reg.paper_title || "—"}</div>
                                <div><span className="text-muted-foreground">Keywords:</span> {reg.keywords || "—"}</div>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admin</div>
                                <div><span className="text-muted-foreground">Payment:</span> {reg.payment_status || "—"}</div>
                                <div><span className="text-muted-foreground">Review:</span> {reg.review_status || "Pending"}</div>
                                <div><span className="text-muted-foreground">Decision sent:</span> {reg.decision_sent ? "Yes" : "No"}</div>
                                <div><span className="text-muted-foreground">Invoice sent:</span> {reg.invoice_sent ? "Yes" : "No"}</div>
                                <div><span className="text-muted-foreground">Registered:</span> {new Date(reg.created_at).toLocaleString()}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-3 border-t border-slate-100 text-xs text-muted-foreground">
            Showing {filtered.length} of {registrations.length} registrations
          </div>
        </div>
      </div>
    </div>
  );
}
