"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";
import Mockup from '../assets/images/login-image.png' 

export default function LoginPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const copy: Record<string, {
    title: string;
    subtitle: string;
    pitchTitle: string;
    pitch1: string;
    pitch2: string;
    pitch3: string;
    email: string;
    password: string;
    remember: string;
    forgot: string;
    submit: string;
    noAccount: string;
    register: string;
  }> = {
    en: {
      title: "Welcome back",
      subtitle: "Access your OmniCheck Network account.",
      pitchTitle: "Secure and seamless",
      pitch1: "Your data is protected and private.",
      pitch2: "Pick up where you left off, anywhere.",
      pitch3: "Collaborate with your care team.",
      email: "Email address",
      password: "Password",
      remember: "Remember me",
      forgot: "Forgot password?",
      submit: "Sign in",
      noAccount: "Don't have an account?",
      register: "Create one",
    },
    de: {
      title: "Willkommen zurück",
      subtitle: "Greifen Sie auf Ihr OmniCheck Network Konto zu.",
      pitchTitle: "Sicher und nahtlos",
      pitch1: "Ihre Daten sind geschützt und privat.",
      pitch2: "Machen Sie überall dort weiter, wo Sie aufgehört haben.",
      pitch3: "Arbeiten Sie mit Ihrem Behandlungsteam zusammen.",
      email: "E‑Mail‑Adresse",
      password: "Passwort",
      remember: "Angemeldet bleiben",
      forgot: "Passwort vergessen?",
      submit: "Anmelden",
      noAccount: "Noch kein Konto?",
      register: "Jetzt erstellen",
    },
    fr: {
      title: "Bon retour",
      subtitle: "Accédez à votre compte OmniCheck Network.",
      pitchTitle: "Sécurisé et fluide",
      pitch1: "Vos données sont protégées et privées.",
      pitch2: "Reprenez où vous vous êtes arrêté, partout.",
      pitch3: "Collaborez avec votre équipe de soins.",
      email: "Adresse e‑mail",
      password: "Mot de passe",
      remember: "Se souvenir de moi",
      forgot: "Mot de passe oublié ?",
      submit: "Se connecter",
      noAccount: "Pas de compte ?",
      register: "Créer un compte",
    },
  };

  const t = copy[lang] ?? copy.en;

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Lazy-load SweetAlert2 if not present
  const ensureSwal = async (): Promise<any> => {
    if (typeof window === 'undefined') return null;
    const w = window as any;
    if (w.Swal) return w.Swal;
    await new Promise<void>((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js';
      s.async = true; s.onload = () => resolve();
      document.body.appendChild(s);
    });
    return (window as any).Swal;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [name]: value as any }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!form.email || !form.password) {
      setMessage("Please enter email and password.");
      return;
    }
    try {
      setSubmitting(true);
      const loginRes = await fetch('https://gdp.codefest.io/app7/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!loginRes.ok) {
        const j = await loginRes.json().catch(() => ({}));
        setMessage(j?.error || "Invalid credentials.");
        return;
      }
      const data = await loginRes.json().catch(() => ({} as any));
      const token = (data?.token || data?.access_token || data?.accessToken || data?.jwt) as string | undefined;
      if (token) {
        try { localStorage.setItem('auth_token', token); } catch {}
        try {
          const maxAge = form.remember ? '; Max-Age=2592000' : '';
          document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax${maxAge}`;
        } catch {}
      }
      const roleRaw = (data?.user?.role || data?.role) as string | undefined;
      const roleUpper = roleRaw ? String(roleRaw).toUpperCase() : undefined;
      if (roleUpper) {
        try { localStorage.setItem('user_role', roleUpper); } catch {}
        try {
          const maxAge = form.remember ? '; Max-Age=2592000' : '';
          document.cookie = `user_role=${encodeURIComponent(roleUpper)}; Path=/; SameSite=Lax${maxAge}`;
        } catch {}
      }
      // Save full name if provided by API
      try {
        const fullName = (data?.fullName || data?.user?.fullName || '').toString().trim();
        if (fullName) localStorage.setItem('fullName', fullName);
      } catch {}
      const Swal = await ensureSwal();
      if (Swal) {
        Swal.fire({
          toast: true, position: 'top-end', showConfirmButton: false, timer: 1800, timerProgressBar: true,
          icon: 'success', title: 'Signed in successfully'
        });
      }
      const path = roleUpper === 'PROFESSIONAL' ? '/portal/professional' : '/portal/patient';
      router.replace(path);
      // Fallback in case router fails silently
      setTimeout(() => {
        if (window?.location?.pathname !== path) {
          window.location.assign(path);
        }
      }, 50);
    } catch (err) {
      setMessage("Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <div className="container">
        <header className={styles.header}>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </header>

        <section className={styles.section}>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className={styles.authCard}>
                <div className="row g-0">
                  <div className="col-lg-6 d-none d-lg-block">
                    <div className={styles.pitchPane}>
                      {/* <div className={styles.brandMark} aria-hidden="true">NN</div> */}
                      <h3 className={styles.pitchTitle}>{t.pitchTitle}</h3>
                      <ul className={styles.pitchList}>
                        <li>{t.pitch1}</li>
                        <li>{t.pitch2}</li>
                        <li>{t.pitch3}</li>
                      </ul>
                      <img src={Mockup.src} alt="" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className={styles.formPane}>
                      <form onSubmit={onSubmit} noValidate>
                        <div className="form-group mb-3">
                          <label htmlFor="email" className="form-label">{t.email}</label>
                          <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onChange} autoComplete="email" required />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="password" className="form-label">{t.password}</label>
                          <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={onChange} autoComplete="current-password" required />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember" name="remember" checked={form.remember} onChange={onChange} />
                            <label className="form-check-label" htmlFor="remember">{t.remember}</label>
                          </div>
                          <a className={styles.mutedLink} href="/forgot-password">{t.forgot}</a>
                        </div>

                        {message && <div className="alert alert-info py-2" role="status">{message}</div>}

                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={submitting}>
                          {submitting ? "..." : t.submit}
                        </button>
                      </form>

                      <div className={styles.alt}>
                        <span>{t.noAccount} <a href="/register">{t.register}</a></span>
                      </div>
                    </div>
                  </div>
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
