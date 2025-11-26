"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";

export default function ContactPage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    h1: string;
    sub: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    sent: string;
    infoTitle: string;
    info1: string;
    info2: string;
  }> = {
    en: {
      h1: "Contact us",
      sub: "We'd love to hear from you. Send us a message and we’ll get back as soon as possible.",
      name: "Your name",
      email: "Email address",
      message: "Message",
      submit: "Send message",
      sent: "Message sent (demo).",
      infoTitle: "How can we help?",
      info1: "Questions about joining OmniCheck Network as a patient or professional.",
      info2: "Partnerships, feedback, or media inquiries.",
    },
    de: {
      h1: "Kontakt",
      sub: "Wir freuen uns über Ihre Nachricht und melden uns so schnell wie möglich.",
      name: "Ihr Name",
      email: "E‑Mail‑Adresse",
      message: "Nachricht",
      submit: "Nachricht senden",
      sent: "Nachricht gesendet (Demo).",
      infoTitle: "Wie können wir helfen?",
      info1: "Fragen zur Teilnahme am OmniCheck Network als Patient:in oder Fachperson.",
      info2: "Partnerschaften, Feedback oder Medienanfragen.",
    },
    fr: {
      h1: "Contact",
      sub: "Nous serions ravis de vous lire. Envoyez-nous un message et nous répondrons rapidement.",
      name: "Votre nom",
      email: "Adresse e‑mail",
      message: "Message",
      submit: "Envoyer",
      sent: "Message envoyé (démo).",
      infoTitle: "Comment pouvons-nous aider ?",
      info1: "Questions sur l’inscription à OmniCheck Network en tant que patient ou professionnel.",
      info2: "Partenariats, retours ou demandes média.",
    },
  };

  const t = copy[lang] ?? copy.en;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    if (!form.name || !form.email || !form.message) {
      setNotice("Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotice(j?.message || t.sent);
        setForm({ name: "", email: "", message: "" });
      } else {
        const msg = Array.isArray(j?.message) ? j.message.join('\n') : (j?.message || 'Failed to send');
        setNotice(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>{t.h1}</h1>
          <p className={styles.subtitle}>{t.sub}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className={styles.infoCard}>
                <div className={styles.badgeRow}>
                  <span className={styles.badge}>Secure</span>
                  <span className={styles.badge}>Fast response</span>
                  <span className={styles.badge}>EU/CH</span>
                </div>
                <h3>{t.infoTitle}</h3>
                <p className="text-muted mb-3">{t.info1}</p>
                <p className="text-muted">{t.info2}</p>
                <div className={styles.media} aria-hidden="true" />
               
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.formCard}>
                <form onSubmit={onSubmit} noValidate>
                  <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">{t.name}</label>
                    <input id="name" name="name" className="form-control" value={form.name} onChange={onChange} required />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">{t.email}</label>
                    <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onChange} required />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="message" className="form-label">{t.message}</label>
                    <textarea id="message" name="message" rows={5} className="form-control" value={form.message} onChange={onChange} required />
                  </div>
                  {notice && <div className="alert alert-info py-2" role="status">{notice}</div>}
                  <button style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid #0c6172"}} type="submit" className={`btn btn-primary ${styles.submit}`} disabled={submitting}>
                    {submitting ? "..." : t.submit}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </main>
    <Footer />
    </div>
  );
}
