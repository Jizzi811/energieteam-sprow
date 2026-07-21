"use client";

import { useMemo, useState } from "react";

type Answers = {
  home: string;
  place: string;
  direction: string;
  shade: string;
  bill: string;
  storage: string;
  service: string;
  timing: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
};

const initial: Answers = {
  home: "",
  place: "",
  direction: "",
  shade: "",
  bill: "",
  storage: "",
  service: "Komplettservice",
  timing: "",
  name: "",
  email: "",
  phone: "",
  postcode: "",
};

const questions = [
  { key: "home", title: "Wie wohnst du?", hint: "Damit wir Zustimmung und Montage richtig einschätzen.", options: ["Miete", "Eigentum", "Gewerbe"] },
  { key: "place", title: "Wo soll die Anlage hin?", hint: "Mehrere Flächen? Wähle die wahrscheinlichste.", options: ["Balkon", "Terrasse", "Flachdach / Garage", "Garten"] },
  { key: "direction", title: "Welche Ausrichtung hat die Fläche?", hint: "Wenn du unsicher bist, ist das kein Problem.", options: ["Süd", "Südost / Südwest", "Ost / West", "Unbekannt"] },
  { key: "shade", title: "Wie viel Schatten fällt auf die Fläche?", hint: "Zum Beispiel durch Bäume, Nachbarhäuser oder das Balkondach.", options: ["Kaum Schatten", "Teilweise Schatten", "Viel Schatten", "Unbekannt"] },
  { key: "bill", title: "Wie hoch sind deine Stromkosten?", hint: "Eine grobe Angabe reicht für die erste Einschätzung.", options: ["Unter 60 € / Monat", "60–100 € / Monat", "Über 100 € / Monat", "Unbekannt"] },
  { key: "storage", title: "Ist ein Stromspeicher interessant?", hint: "Damit lässt sich Solarstrom auch später am Tag nutzen.", options: ["Ja, gerne", "Vielleicht", "Nein", "Beratung gewünscht"] },
  { key: "timing", title: "Wann möchtest du starten?", hint: "So können wir deine Anfrage passend priorisieren.", options: ["So bald wie möglich", "In 1–3 Monaten", "Später", "Erst informieren"] },
] as const;

export default function Home() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [done, setDone] = useState(false);
  const [fileName, setFileName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const score = useMemo(() => {
    let value = 58;
    if (["Süd", "Südost / Südwest"].includes(answers.direction)) value += 16;
    if (answers.shade === "Kaum Schatten") value += 12;
    if (answers.timing === "So bald wie möglich") value += 8;
    if (answers.place) value += 6;
    return Math.min(value, 96);
  }, [answers]);

  const startCheck = () => {
    setOpen(true);
    setStep(0);
    setDone(false);
    setTimeout(() => document.getElementById("solarcheck")?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  const choose = (key: keyof Answers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    if (step < questions.length - 1) setTimeout(() => setStep((current) => current + 1), 180);
    else setTimeout(() => setStep(questions.length), 180);
  };

  const sendRequest = async () => {
    setSending(true);
    setSendError("");
    const form = new FormData();
    Object.entries(answers).forEach(([key, value]) => form.append(key, value));
    form.append("score", String(score));
    if (photo) form.append("photo", photo);
    try {
      const response = await fetch("/api/leads", { method: "POST", body: form });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Die Anfrage konnte nicht gesendet werden.");
      setDone(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Die Anfrage konnte nicht gesendet werden.");
    } finally {
      setSending(false);
    }
  };

  const question = questions[step];

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top" aria-label="EnergieTeam Sprow Startseite">
          <span className="brand-mark" aria-hidden="true"><i /><b /></span>
          <span><strong>EnergieTeam</strong> Sprow<small>Energielösungen aus einer Hand</small></span>
        </a>
        <nav aria-label="Hauptnavigation">
          <a href="#leistungen">Leistungen</a><a href="#ablauf">Ablauf</a><a href="#kontakt">Kontakt</a>
        </nav>
        <button className="nav-cta" onClick={startCheck}>Solar-Check</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow"><i /> Deutschlandweit für dich da</span>
          <h1>Dein Balkon.<br />Deine Energie.<br /><em>Deine Ersparnis.</em></h1>
          <p>Finde in nur 2 Minuten heraus, welches Balkonkraftwerk zu deinem Zuhause passt – inklusive persönlicher Empfehlung von EnergieTeam Sprow.</p>
          <div className="hero-actions">
            <button className="primary" onClick={startCheck}>Kostenlosen Solar-Check starten <span>→</span></button>
            <a className="phone" href="tel:+4916096769316">Persönlich beraten lassen</a>
          </div>
          <div className="trust-row"><span>✓ Unverbindlich</span><span>✓ Persönliche Beratung</span><span>✓ Alles aus einer Hand</span></div>
        </div>
        <div className="solar-visual" aria-label="Animierte Darstellung eines Hauses mit Balkonkraftwerk">
          <div className="scene-glow" /><div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="spark spark-one" /><div className="spark spark-two" /><div className="spark spark-three" />
          <div className="sun" /><div className="cloud cloud-one" /><div className="cloud cloud-two" />
          <div className="house"><div className="roof"><div className="panels">{Array.from({ length: 8 }).map((_, i) => <i key={i} />)}</div></div><div className="wall"><span /><b /></div></div>
          <div className="energy-flow"><i /><i /><i /></div>
          <div className="energy-card"><small><i /> Live-Potenzial</small><strong>Bis zu 800 W</strong><span>saubere Energie für Zuhause</span></div>
          <div className="mini-card"><span>☀</span><div><small>Eigenstrom</small><strong>Tag für Tag</strong></div></div>
        </div>
      </section>

      <section className="proof"><div><strong>100 %</strong><span>individuelle Beratung</span></div><div><strong>1 Partner</strong><span>von Planung bis Montage</span></div><div><strong>DE-weit</strong><span>persönlich für dich da</span></div></section>

      <section className="check-wrap" id="solarcheck">
        {!open ? (
          <div className="check-intro"><span className="section-tag">Kostenloser Eignungscheck</span><h2>Wie viel Sonne steckt in deinem Zuhause?</h2><p>Beantworte sieben kurze Fragen. Du erhältst sofort eine erste Einschätzung – verständlich und ohne Fachchinesisch.</p><button className="primary" onClick={startCheck}>Jetzt Eignung prüfen <span>→</span></button></div>
        ) : (
          <div className="check-card">
            <div className="progress"><span style={{ width: `${Math.min(((step + 1) / 9) * 100, 100)}%` }} /></div>
            {step < questions.length && question ? (
              <div className="question"><div className="step-label">Frage {step + 1} von {questions.length}</div><h2>{question.title}</h2><p>{question.hint}</p><div className="option-grid">{question.options.map((option) => <button key={option} className={answers[question.key] === option ? "selected" : ""} onClick={() => choose(question.key, option)}><i />{option}<span>→</span></button>)}</div>{step > 0 && <button className="back" onClick={() => setStep(step - 1)}>← Zurück</button>}</div>
            ) : !done ? (
              <div className="lead-form"><div className="result-badge">Sehr gute Grundlage · {score}/100</div><h2>Deine persönliche Empfehlung ist fast fertig.</h2><p>Wohin dürfen wir deine Auswertung schicken? EnergieTeam Sprow meldet sich auf Wunsch persönlich bei dir.</p><div className="fields"><label>Vor- und Nachname<input value={answers.name} onChange={(e) => setAnswers({ ...answers, name: e.target.value })} placeholder="Max Mustermann" /></label><label>Postleitzahl<input value={answers.postcode} onChange={(e) => setAnswers({ ...answers, postcode: e.target.value })} placeholder="12345" inputMode="numeric" /></label><label>E-Mail-Adresse<input value={answers.email} onChange={(e) => setAnswers({ ...answers, email: e.target.value })} placeholder="name@beispiel.de" type="email" /></label><label>Telefonnummer<input value={answers.phone} onChange={(e) => setAnswers({ ...answers, phone: e.target.value })} placeholder="Für den Rückruf" type="tel" /></label></div><label className="upload">📷 <span><strong>Foto vom Montageort hinzufügen</strong><small>{fileName || "Optional – hilft bei der ersten Einschätzung"}</small></span><input type="file" accept="image/*" onChange={(e) => { const next = e.target.files?.[0] || null; setPhoto(next); setFileName(next?.name || ""); }} /></label><label className="consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required /> <span>Ich stimme zu, dass EnergieTeam Sprow meine Angaben zur Bearbeitung meiner Anfrage verwendet. Hinweise zum Datenschutz habe ich gelesen.</span></label>{sendError && <p className="form-error">{sendError}</p>}<button className="primary wide" disabled={!answers.name || !answers.email || !answers.postcode || !consent || sending} onClick={sendRequest}>{sending ? "Anfrage wird sicher übertragen …" : "Auswertung & Beratung anfordern"} {!sending && <span>→</span>}</button><small className="safe">🔒 Deine Angaben werden ausschließlich zur Bearbeitung deiner Anfrage genutzt.</small></div>
            ) : (
              <div className="success"><div>✓</div><h2>Deine Anfrage ist angekommen!</h2><p>Vielen Dank. EnergieTeam Sprow hat deine Angaben erhalten und kann sich nun persönlich bei dir melden.</p><a className="primary" href="tel:+4916096769316">Jetzt direkt anrufen</a></div>
            )}
          </div>
        )}
      </section>

      <section className="services" id="leistungen"><span className="section-tag">Alles aus einer Hand</span><h2>Von der ersten Idee bis zum eigenen Sonnenstrom</h2><p className="section-copy">Ein Ansprechpartner begleitet dich durch den gesamten Prozess – persönlich, verständlich und passend zu deinem Zuhause.</p><div className="service-grid">{[["01","Beratung","Wir klären Bedarf, Standort und Möglichkeiten."],["02","Planung & Auswahl","Du erhältst eine Lösung, die technisch und wirtschaftlich passt."],["03","Lieferung","Alle abgestimmten Komponenten kommen zuverlässig zu dir."],["04","Montage","Fachgerechte Installation für einen sicheren Start."]].map(([n,t,d]) => <article key={n}><span>{n}</span><div className="service-icon">{n === "01" ? "☀" : n === "02" ? "▦" : n === "03" ? "⌂" : "✓"}</div><h3>{t}</h3><p>{d}</p></article>)}</div></section>

      <section className="steps" id="ablauf"><div><span className="section-tag light">So einfach geht’s</span><h2>Drei Schritte zu deiner Energielösung</h2></div><ol><li><b>1</b><span><strong>Solar-Check ausfüllen</strong>In wenigen Minuten kennen wir die wichtigsten Eckdaten.</span></li><li><b>2</b><span><strong>Persönlich beraten lassen</strong>Wir prüfen deine Situation und beantworten deine Fragen.</span></li><li><b>3</b><span><strong>Sonnenstrom nutzen</strong>Wir liefern und montieren die passende Lösung.</span></li></ol></section>

      <section className="contact" id="kontakt"><div><span className="section-tag">Direkter Draht</span><h2>Lieber persönlich sprechen?</h2><p>Gabriele Sprow und ihr Team beraten dich gerne zu Balkonkraftwerken, Photovoltaik, Speichern und weiteren Energielösungen.</p></div><div className="contact-card"><a href="tel:+4916096769316"><small>Telefon</small><strong>+49 160 96 76 93 16</strong></a><a href="mailto:energieteam.sprow@gmail.com"><small>E-Mail</small><strong>energieteam.sprow@gmail.com</strong></a></div></section>

      <footer><div className="brand footer-brand"><span className="brand-mark"><i /><b /></span><span><strong>EnergieTeam</strong> Sprow<small>Energielösungen aus einer Hand</small></span></div><p>Beratung · Verkauf · Lieferung · Montage – deutschlandweit</p><div><a href="https://www.energieteamsprow.com/impressum">Impressum</a><a href="https://www.energieteamsprow.com/datenschutz">Datenschutz</a></div><small>© 2026 EnergieTeam Sprow · Inh. Gabriele Sprow</small></footer>
    </main>
  );
}
