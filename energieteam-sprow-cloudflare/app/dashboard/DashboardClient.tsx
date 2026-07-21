"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = { id:string; name:string; email:string; phone:string; postcode:string; home:string; place:string; direction:string; shade:string; bill:string; storage:string; timing:string; score:number; status:string; photoKey:string|null; createdAt:string };
const statuses = ["Neu", "Kontaktiert", "Angebot", "Abgeschlossen", "Archiviert"];

export default function DashboardClient({ displayName, signOutPath }: { displayName:string; signOutPath:string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("Alle");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead|null>(null);

  useEffect(() => { fetch("/api/leads").then(r => r.json()).then(data => setLeads(data.leads || [])).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => filter === "Alle" ? leads : leads.filter(l => l.status === filter), [filter, leads]);
  const updateStatus = async (lead:Lead, status:string) => { setLeads(current => current.map(l => l.id === lead.id ? {...l,status} : l)); setSelected(current => current?.id === lead.id ? {...current,status} : current); await fetch("/api/leads", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:lead.id,status}) }); };

  return <main className="dashboard">
    <header className="dash-nav"><div className="brand"><span className="brand-mark"><i/><b/></span><span><strong>EnergieTeam</strong> Sprow<small>Lead-Zentrale</small></span></div><div><span>{displayName}</span><a href={signOutPath}>Abmelden</a></div></header>
    <section className="dash-head"><div><span className="section-tag">Lead-Dashboard</span><h1>Neue Energieanfragen</h1><p>Alle Balkonkraftwerk-Anfragen an einem Ort.</p></div><div className="dash-stats"><article><strong>{leads.length}</strong><span>Gesamt</span></article><article><strong>{leads.filter(l=>l.status==="Neu").length}</strong><span>Neu</span></article><article><strong>{leads.filter(l=>l.status==="Angebot").length}</strong><span>Angebote</span></article></div></section>
    <nav className="filters">{["Alle",...statuses].map(s => <button key={s} className={filter===s?"active":""} onClick={()=>setFilter(s)}>{s}</button>)}</nav>
    {loading ? <div className="empty">Leads werden geladen …</div> : filtered.length === 0 ? <div className="empty"><strong>Noch keine passenden Anfragen</strong><span>Neue Leads erscheinen automatisch hier.</span></div> : <div className="lead-list">{filtered.map(lead => <button className="lead-row" key={lead.id} onClick={()=>setSelected(lead)}><span className="lead-score">{lead.score}</span><span><strong>{lead.name}</strong><small>{lead.postcode} · {lead.place} · {lead.timing}</small></span><span className={`status status-${lead.status.toLowerCase()}`}>{lead.status}</span><time>{new Date(lead.createdAt).toLocaleDateString("de-DE")}</time><b>→</b></button>)}</div>}
    {selected && <div className="drawer-backdrop" onClick={()=>setSelected(null)}><aside className="lead-drawer" onClick={e=>e.stopPropagation()}><button className="drawer-close" onClick={()=>setSelected(null)}>×</button><span className="section-tag">Lead #{selected.id.slice(0,8)}</span><h2>{selected.name}</h2><div className="drawer-contact"><a href={`tel:${selected.phone}`}>{selected.phone || "Keine Telefonnummer"}</a><a href={`mailto:${selected.email}`}>{selected.email}</a></div><dl><div><dt>PLZ</dt><dd>{selected.postcode}</dd></div><div><dt>Wohnsituation</dt><dd>{selected.home}</dd></div><div><dt>Montageort</dt><dd>{selected.place}</dd></div><div><dt>Ausrichtung</dt><dd>{selected.direction}</dd></div><div><dt>Verschattung</dt><dd>{selected.shade}</dd></div><div><dt>Stromkosten</dt><dd>{selected.bill}</dd></div><div><dt>Speicher</dt><dd>{selected.storage}</dd></div><div><dt>Zeitraum</dt><dd>{selected.timing}</dd></div></dl>{selected.photoKey && <a className="photo-link" href={`/api/leads/photo?id=${selected.id}`} target="_blank">📷 Foto vom Montageort ansehen</a>}<label>Status<select value={selected.status} onChange={e=>updateStatus(selected,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label></aside></div>}
  </main>;
}
