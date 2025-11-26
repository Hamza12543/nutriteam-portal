"use client";
import { useState } from "react";
import Footer from "../components/Footer";
import styles from "../login/page.module.scss";
import { useLanguage } from "../providers/LanguageProvider";

export default function ForgotPasswordPage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    title: string;
    subtitle: string;
    email: string;
    submit: string;
    back: string;
    generic: string;
    invalidEmail: string;
  }> = {
    en: {
      title: "Forgot password",
      subtitle: "Enter your email and we'll send you a reset link if an account exists.",
      email: "Email address",
      submit: "Send reset link",
      back: "Back to login",
      generic: "If a user with that email exists, a password reset link has been sent.",
      invalidEmail: "Please enter a valid email.",
    },
    de: {
      title: "Passwort vergessen",
      subtitle: "Geben Sie Ihre E‑Mail ein. Falls ein Konto existiert, senden wir einen Zurücksetzlink.",
      email: "E‑Mail‑Adresse",
      submit: "Link senden",
      back: "Zur Anmeldung",
      generic: "Falls ein Konto mit dieser E‑Mail existiert, wurde ein Link zum Zurücksetzen gesendet.",
      invalidEmail: "Bitte geben Sie eine gültige E‑Mail ein.",
    },
    fr: {
      title: "Mot de passe oublié",
      subtitle: "Entrez votre e‑mail. Si un compte existe, nous enverrons un lien de réinitialisation.",
      email: "Adresse e‑mail",
      submit: "Envoyer le lien",
      back: "Retour à la connexion",
      generic: "Si un utilisateur avec cet e‑mail existe, un lien de réinitialisation a été envoyé.",
      invalidEmail: "Veuillez saisir une adresse e‑mail valide.",
    },
  };
  const t = copy[lang] ?? copy.en;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMessage(t.invalidEmail);
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // For security, show the same generic message regardless of the response
      if (!res.ok) {
        setMessage(t.generic);
        return;
      }
      const j = await res.json().catch(() => ({}));
      setMessage(j?.message || t.generic);
    } catch {
      setMessage(t.generic);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <div className="container">
        <header className={styles.header}>
          <h1 style={{ color: "var(--brand-primary)" }}>{t.title}</h1>
          <p>{t.subtitle}</p>
        </header>

        <section className={styles.section}>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className={styles.authCard}>
                <div className="p-4 p-md-5">
                  <form onSubmit={onSubmit} noValidate>
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label">{t.email}</label>
                      <input id="email" name="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                    </div>

                    {message && <div className="alert alert-info py-2" role="status">{message}</div>}

                    <div className="d-flex gap-2 justify-content-between mt-5">
                      <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} style={{maxWidth:"60%", backgroundColor: "var(--brand-primary)"}} disabled={submitting}>
                        {submitting ? "..." : t.submit}
                      </button>
                      <a href="/login" className="btn btn-outline-secondary" style={{color: "var(--brand-primary)"}}>{t.back}</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
