"use client";
import Link from "next/link";
import styles from "./page.module.scss";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";

export default function PortalIndexPage() {
  const { lang } = useLanguage();
  const copy: Record<string, { h1: string; sub: string; patient: string; pro: string; }> = {
    en: { h1: "Your portal", sub: "Choose your workspace.", patient: "Patient portal", pro: "Professional portal" },
    de: { h1: "Ihr Portal", sub: "Wählen Sie Ihren Arbeitsbereich.", patient: "Patient:innen-Portal", pro: "Fachpersonen-Portal" },
    fr: { h1: "Votre portail", sub: "Choisissez votre espace.", patient: "Portail patient", pro: "Portail professionnel" },
  };
  const t = copy[lang] ?? copy.en;
  return (
    <main className={styles.wrapper}>
      <div className="container">
        <header className={styles.header}>
          <h1>{t.h1}</h1>
          <p>{t.sub}</p>
        </header>
        <section className={styles.section}>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h4>{t.patient}</h4>
              <p>Track your care, manage appointments, and explore resources.</p>
              <Link style={{backgroundColor:"#0c6172",color:"white", border: "1px solid #0c6172"}} className="btn btn-primary btn-sm" href="/portal/patient">Open</Link>
            </div>
            <div className={styles.card}>
              <h4>{t.pro}</h4> 
              <p>Manage your profile, connect with patients, and view insights.</p>
              <Link style={{backgroundColor:"#0c6172",color:"white", border: "1px solid #0c6172"}} className="btn btn-primary btn-sm" href="/portal/professional">Open</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
