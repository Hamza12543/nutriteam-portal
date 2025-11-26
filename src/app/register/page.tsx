"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";
import Mockup from '../assets/images/login-image.png'

export default function RegisterPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const copy: Record<string, {
    title: string;
    subtitle: string;
    pitchTitle: string;
    pitch1: string;
    pitch2: string;
    pitch3: string;
    name: string;
    email: string;
    password: string;
    confirm: string;
    role: string;
    role_patient: string;
    role_professional: string;
    submit: string;
    haveAccount: string;
    login: string;
  }> = {
    en: {
      title: "Create your account",
      subtitle: "Join a trusted community for functional, preventative and holistic healthcare.",
      pitchTitle: "Why join OmniCheck Network",
      pitch1: "Connect with verified professionals across Europe.",
      pitch2: "Discover tailored resources and guidance.",
      pitch3: "Track your journey and collaborate securely.",
      name: "Full name",
      email: "Email address",
      password: "Password",
      confirm: "Confirm password",
      role: "I am",
      role_patient: "A patient",
      role_professional: "A healthcare professional",
      submit: "Create account",
      haveAccount: "Already have an account?",
      login: "Log in",
    },
    de: {
      title: "Konto erstellen",
      subtitle: "Werden Sie Teil einer vertrauenswürdigen Community für funktionelle, präventive und ganzheitliche Gesundheit.",
      pitchTitle: "Warum dem OmniCheck Network beitreten",
      pitch1: "Vernetzen Sie sich mit verifizierten Fachpersonen in Europa.",
      pitch2: "Entdecken Sie passende Ressourcen und Leitfäden.",
      pitch3: "Verfolgen Sie Ihren Weg und arbeiten Sie sicher zusammen.",
      name: "Vollständiger Name",
      email: "E‑Mail‑Adresse",
      password: "Passwort",
      confirm: "Passwort bestätigen",
      role: "Ich bin",
      role_patient: "Eine/r Patient:in",
      role_professional: "Eine Gesundheitsfachperson",
      submit: "Konto erstellen",
      haveAccount: "Bereits ein Konto?",
      login: "Anmelden",
    },
    fr: {
      title: "Créer votre compte",
      subtitle: "Rejoignez une communauté de confiance en santé fonctionnelle, préventive et holistique.",
      pitchTitle: "Pourquoi rejoindre OmniCheck Network",
      pitch1: "Connectez‑vous avec des professionnels vérifiés en Europe.",
      pitch2: "Découvrez des ressources et des guides adaptés.",
      pitch3: "Suivez votre parcours et collaborez en toute sécurité.",
      name: "Nom complet",
      email: "Adresse e‑mail",
      password: "Mot de passe",
      confirm: "Confirmez le mot de passe",
      role: "Je suis",
      role_patient: "Un patient",
      role_professional: "Un professionnel de santé",
      submit: "Créer le compte",
      haveAccount: "Vous avez déjà un compte ?",
      login: "Se connecter",
    },
  };

  const t = copy[lang] ?? copy.en;
  // Additional UI strings not covered by existing copy
  const ui: Record<string, {
    headerTitle: string; headerSub: string;
    sectionPersonal: string; firstName: string; lastName: string;
    phone: string; company: string;
    sectionLocation: string; address: string; country: string; selectOption: string; postalCode: string; state: string; city: string;
    sectionInterests: string; interestMobile: string; interestMobileDesc: string; interestWeb: string; interestWebDesc: string; interestBoth: string; interestBothDesc: string;
    back: string; next: string;
    sectionConfirm: string; newsletterLabel: string; acceptPrefix: string; privacy: string; acceptSuffix: string; summary: string; from: string;
  }> = {
    en: {
      headerTitle: "Register now for free", headerSub: "Sign up and get instant access to our apps",
      sectionPersonal: "Personal Data", firstName: "First name", lastName: "Last name",
      phone: "Telephone (optional)", company: "Companies (optional)",
      sectionLocation: "Location", address: "Address", country: "Country", selectOption: "Select", postalCode: "Postal code", state: "State/Canton", city: "City",
      sectionInterests: "Your interests", interestMobile: "Mobile App", interestMobileDesc: "Interested in our iOS & Android app?", interestWeb: "Web App", interestWebDesc: "Interested in our web platform?", interestBoth: "Both", interestBothDesc: "Interested in all our platforms?",
      back: "Back", next: "Further",
      sectionConfirm: "Confirmation", newsletterLabel: "I would like to subscribe to the newsletter", acceptPrefix: "I accept the ", privacy: "privacy policy", acceptSuffix: ".", summary: "Summary:", from: "from",
    },
    de: {
      headerTitle: "Jetzt kostenlos registrieren", headerSub: "Registrieren und sofort Zugriff auf unsere Apps erhalten",
      sectionPersonal: "Persönliche Daten", firstName: "Vorname", lastName: "Nachname",
      phone: "Telefon (optional)", company: "Unternehmen (optional)",
      sectionLocation: "Adresse", address: "Adresse", country: "Land", selectOption: "Auswählen", postalCode: "Postleitzahl", state: "Bundesland/Kanton", city: "Stadt",
      sectionInterests: "Ihre Interessen", interestMobile: "Mobile‑App", interestMobileDesc: "Interessiert an unserer iOS & Android‑App?", interestWeb: "Web‑App", interestWebDesc: "Interessiert an unserer Web‑Plattform?", interestBoth: "Beides", interestBothDesc: "Interessiert an allen unseren Plattformen?",
      back: "Zurück", next: "Weiter",
      sectionConfirm: "Bestätigung", newsletterLabel: "Ich möchte den Newsletter abonnieren", acceptPrefix: "Ich akzeptiere die ", privacy: "Datenschutzerklärung", acceptSuffix: ".", summary: "Zusammenfassung:", from: "aus",
    },
    fr: {
      headerTitle: "Inscrivez‑vous gratuitement", headerSub: "Créez un compte et accédez instantanément à nos applications",
      sectionPersonal: "Données personnelles", firstName: "Prénom", lastName: "Nom",
      phone: "Téléphone (optionnel)", company: "Sociétés (optionnel)",
      sectionLocation: "Adresse", address: "Adresse", country: "Pays", selectOption: "Sélectionner", postalCode: "Code postal", state: "État/Canton", city: "Ville",
      sectionInterests: "Vos centres d’intérêt", interestMobile: "Application mobile", interestMobileDesc: "Intéressé par notre app iOS & Android ?", interestWeb: "Application web", interestWebDesc: "Intéressé par notre plateforme web ?", interestBoth: "Les deux", interestBothDesc: "Intéressé par toutes nos plateformes ?",
      back: "Retour", next: "Continuer",
      sectionConfirm: "Confirmation", newsletterLabel: "Je souhaite m’abonner à la newsletter", acceptPrefix: "J’accepte la ", privacy: "politique de confidentialité", acceptSuffix: ".", summary: "Récapitulatif :", from: "depuis",
    },
  };
  const L = ui[lang] ?? ui.en;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    role: "patient" as "patient" | "pro",
    phone: "",
    company: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    interest: "both" as "mobile" | "web" | "both",
    newsletter: false,
    accept: false,
  });
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Lazy-load SweetAlert2 when needed
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const onCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((f) => ({ ...f, [name]: checked }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (step < 3) {
      // Prevent accidental submit before final step
      return;
    }

    const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();
    if (!fullName || !form.email || !form.password || !form.confirm) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!form.accept) {
      setMessage("Please accept the privacy policy to continue.");
      return;
    }

    try {
      setSubmitting(true);
      // Create account via API
      const payload: any = {
        email: form.email,
        password: form.password,
        role: form.role === 'pro' ? 'PROFESSIONAL' : 'PATIENT',
       firstName: form.firstName,
       lastName: form.lastName,
       
        // Optional extras
        phone: form.phone || undefined,
        company: form.company || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
        state: form.state || undefined,
        address: form.address || undefined,
        postalCode: form.postalCode || undefined,
        interest: form.interest,
        newsletter: form.newsletter,
      };
      const res = await fetch('https://gdp.codefest.io/app7/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(j?.error || 'Registration failed');
        return;
      }
      // Auto sign-in via backend
      const loginRes = await fetch('https://gdp.codefest.io/app7/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!loginRes.ok) {
        const lj = await loginRes.json().catch(() => ({}));
        setMessage(lj?.error || 'Account created, but login failed');
        return;
      }
      const data = await loginRes.json().catch(() => ({} as any));
      const token = (data?.token || data?.access_token || data?.accessToken || data?.jwt) as string | undefined;
      if (token) {
        try { localStorage.setItem('auth_token', token); } catch {}
        try {
          const maxAge = form.newsletter ? '; Max-Age=2592000' : '';
          document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax${maxAge}`;
        } catch {}
      }
      const roleRaw = (data?.user?.role || data?.role) as string | undefined;
      const roleUpper = roleRaw ? String(roleRaw).toUpperCase() : (form.role === 'pro' ? 'PROFESSIONAL' : 'PATIENT');
      if (roleUpper) {
        try { localStorage.setItem('user_role', roleUpper); } catch {}
        try {
          const maxAge = form.newsletter ? '; Max-Age=2592000' : '';
          document.cookie = `user_role=${encodeURIComponent(roleUpper)}; Path=/; SameSite=Lax${maxAge}`;
        } catch {}
      }
      // Sweet alert success
      try {
        const Swal = await ensureSwal();
        if (Swal) {
          Swal.fire({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, timerProgressBar: true,
            icon: 'success', title: 'Account created successfully'
          });
        }
      } catch {}
      setMessage('Registered successfully. Redirecting...');
      const path = roleUpper === 'PROFESSIONAL' ? '/portal/professional' : '/portal/patient';
      router.replace(path);
      setTimeout(() => {
        if (window?.location?.pathname !== path) {
          window.location.assign(path);
        }
      }, 50);
    } catch (err) {
      setMessage("Registration failed (demo).");
    } finally {
      setSubmitting(false);
    }
  };

  // Step guards for "Further" buttons
  const emailValid = /\S+@\S+\.\S+/.test(form.email);
  const canNext0 = Boolean(
    form.firstName &&
    form.lastName &&
    emailValid &&
    form.password &&
    form.confirm &&
    form.password === form.confirm
  );
  const canNext1 = Boolean(
    form.address &&
    form.country &&
    form.postalCode &&
    form.city
  );

  return (
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <div className="container">
        <header className={styles.headerCenter}>
          <h1>{L.headerTitle}</h1>
          <p>{L.headerSub}</p>
        </header>

        <section className={styles.sectionCenter}>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className={styles.stepCard}>
                <form onSubmit={onSubmit} noValidate>
                  <div className={styles.stepsBar} aria-hidden="true">
                    <span className={`${styles.step} ${step >= 0 ? styles.active : ''}`}></span>
                    <span className={`${styles.step} ${step >= 1 ? styles.active : ''}`}></span>
                    <span className={`${styles.step} ${step >= 2 ? styles.active : ''}`}></span>
                    <span className={`${styles.step} ${step >= 3 ? styles.active : ''}`}></span>
                  </div>
                {step === 0 && (
                  <div>
                    <h3 className={styles.sectionTitle}>{L.sectionPersonal}</h3>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label">{L.firstName}</label>
                        <input id="firstName" name="firstName" type="text" className="form-control" value={form.firstName} onChange={onChange} autoComplete="given-name" />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">{L.lastName}</label>
                        <input id="lastName" name="lastName" type="text" className="form-control" value={form.lastName} onChange={onChange} autoComplete="family-name" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">{t.email}</label>
                        <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onChange} autoComplete="email" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="phone" className="form-label">{L.phone}</label>
                        <input id="phone" name="phone" type="tel" className="form-control" value={form.phone} onChange={onChange} autoComplete="tel" placeholder="+49 123 456789" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="company" className="form-label">{L.company}</label>
                        <input id="company" name="company" type="text" className="form-control" value={form.company} onChange={onChange} placeholder="My company" />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="password" className="form-label">{t.password}</label>
                        <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={onChange} autoComplete="new-password" />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="confirm" className="form-label">{t.confirm}</label>
                        <input id="confirm" name="confirm" type="password" className="form-control" value={form.confirm} onChange={onChange} autoComplete="new-password" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="role" className="form-label">{t.role}</label>
                        <select id="role" name="role" className="form-control" value={form.role} onChange={onChange}>
                          <option value="patient">{t.role_patient}</option>
                          <option value="pro">{t.role_professional}</option>
                        </select>
                      </div>
                    </div>
                    {message && <div className="alert alert-info py-2 mt-3" role="status">{message}</div>}
                    <div className={styles.actions}>
                      <button type="button" className={`btn btn-primary ${styles.nextBtn}`} onClick={()=>setStep(1)} disabled={!canNext0}>Further</button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 className={styles.sectionTitle}>{L.sectionLocation}</h3>
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="address" className="form-label">{L.address}</label>
                        <input id="address" name="address" type="text" className="form-control" value={form.address} onChange={onChange} autoComplete="address-line1" placeholder="Street and number" />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="country" className="form-label">{L.country}</label>
                        <select id="country" name="country" className="form-control" value={form.country} onChange={onChange}>
                          <option value="">{L.selectOption}</option>
                          <option value="Germany">Germany</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="Austria">Austria</option>
                          <option value="France">France</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="postalCode" className="form-label">{L.postalCode}</label>
                        <input id="postalCode" name="postalCode" type="text" className="form-control" value={form.postalCode} onChange={onChange} autoComplete="postal-code" placeholder="e.g. 10115" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="state" className="form-label">{L.state}</label>
                        <input id="state" name="state" type="text" className="form-control" value={form.state} onChange={onChange} placeholder="e.g. Bavaria" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="city" className="form-label">{L.city}</label>
                        <input id="city" name="city" type="text" className="form-control" value={form.city} onChange={onChange} placeholder="e.g. Munich" />
                      </div>
                    </div>
                    {message && <div className="alert alert-info py-2 mt-3" role="status">{message}</div>}
                    <div className={styles.actionsBetween}>
                      <button type="button" className={`btn btn-light ${styles.backBtn}`} onClick={()=>setStep(0)}>{L.back}</button>
                      <button  type="button" className={`btn btn-primary ${styles.nextBtn}`} onClick={()=>setStep(2)} disabled={!canNext1}>
                        {L.next}
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className={styles.sectionTitle}>{L.sectionInterests}</h3>
                    <div className={styles.choices} role="radiogroup" aria-label={L.sectionInterests}>
                      <label className={`${styles.choice} ${form.interest==='mobile' ? styles.choiceActive : ''}`}>
                        <input type="radio" name="interest" value="mobile" checked={form.interest==='mobile'} onChange={onChange} />
                        <div>
                          <div className={styles.choiceTitle}>{L.interestMobile}</div>
                          <div className={styles.choiceDesc}>{L.interestMobileDesc}</div>
                        </div>
                      </label>
                      <label className={`${styles.choice} ${form.interest==='web' ? styles.choiceActive : ''}`}>
                        <input type="radio" name="interest" value="web" checked={form.interest==='web'} onChange={onChange} />
                        <div>
                          <div className={styles.choiceTitle}>{L.interestWeb}</div>
                          <div className={styles.choiceDesc}>{L.interestWebDesc}</div>
                        </div>
                      </label>
                      <label className={`${styles.choice} ${form.interest==='both' ? styles.choiceActive : ''}`}>
                        <input type="radio" name="interest" value="both" checked={form.interest==='both'} onChange={onChange} />
                        <div>
                          <div className={styles.choiceTitle}>{L.interestBoth}</div>
                          <div className={styles.choiceDesc}>{L.interestBothDesc}</div>
                        </div>
                      </label>
                    </div>
                    <div className={styles.actionsBetween}>
                      <button type="button" className={`btn btn-light ${styles.backBtn}`} onClick={()=>setStep(1)}>{L.back}</button>
                      <button type="button" className={`btn btn-primary ${styles.nextBtn}`} onClick={()=>setStep(3)}>{L.next}</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className={styles.sectionTitle}>{L.sectionConfirm}</h3>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id="newsletter" name="newsletter" checked={form.newsletter} onChange={onCheckbox} />
                      <label className="form-check-label" htmlFor="newsletter">{L.newsletterLabel}</label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="accept" name="accept" checked={form.accept} onChange={onCheckbox} />
                      <label className="form-check-label" htmlFor="accept">{L.acceptPrefix}<a href="/privacy" target="_blank" rel="noopener noreferrer">{L.privacy}</a>{L.acceptSuffix}</label>
                    </div>
                    <div className={styles.summaryBox}>
                      <strong>{L.summary}</strong> {`${form.firstName} ${form.lastName}`.trim()} ({form.email}) {L.from} {form.city || '—'} , {form.country || '—'}
                    </div>
                    <div className={styles.actionsBetween}>
                      <button type="button" className={`btn btn-light ${styles.backBtn}`} onClick={()=>setStep(2)}>{L.back}</button>
                      <button type="submit" className={`btn btn-primary ${styles.nextBtn}`} disabled={submitting || !form.accept}>
                        {submitting ? "..." : L.next}
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.altCenter}> 
                  <span>{t.haveAccount} <a href="/login">{t.login}</a></span>
                </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
