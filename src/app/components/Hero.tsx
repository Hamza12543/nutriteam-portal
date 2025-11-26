"use client";
import styles from "./Hero.module.scss";
import { useLanguage } from "../providers/LanguageProvider";

export default function Hero() {
  const { lang } = useLanguage();

  const copy: Record<string, { title: string; lead: string; desc: string; ctaPrimary: string; ctaSecondary: string }>= {
    en: {
      title: "Network for Functional Medicine",
      lead: "Health is more than the absence of disease — it’s the result of a finely tuned interaction between body, mind, and environment.",
      desc: "Our network brings together physicians, therapists, and healthcare professionals dedicated to functional medicine — a modern, root-cause approach that sees the person as a whole.",
      ctaPrimary: "For Patients",
      ctaSecondary: "For Professionals",
    },
    de: {
      title: "Netzwerk für Funktionelle Medizin",
      lead: "Gesundheit bedeutet mehr als die Abwesenheit von Krankheit – sie ist das Ergebnis eines fein abgestimmten Zusammenspiels von Körper, Geist und Umwelt.",
      desc: "Unser Netzwerk vereint Ärzt:innen, Therapeut:innen und Heilpraktiker:innen, die sich der funktionellen Medizin verschrieben haben – einer modernen, ursachenorientierten Herangehensweise, die den Menschen als Ganzes betrachtet.",
      ctaPrimary: "Für Patient:innen",
      ctaSecondary: "Für Fachpersonen",
    },
    fr: {
      title: "Réseau de Médecine Fonctionnelle",
      lead: "La santé ne se résume pas à l’absence de maladie – elle résulte d’une interaction harmonieuse entre le corps, l’esprit et l’environnement.",
      desc: "Notre réseau réunit des médecins, thérapeutes et professionnels de santé engagés dans la médecine fonctionnelle – une approche moderne et causale qui considère la personne dans sa globalité.",
      ctaPrimary: "Pour les patient·e·s",
      ctaSecondary: "Pour les professionnel·le·s",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
        <h1 className={styles.heroTitle}><span className={styles.accent}>{t.title}</span></h1>
        <p className={styles.heroSubtitle}>{t.lead}</p>
        <p className={styles.heroSubtitle}>{t.desc}</p>

        <div className={styles.actions}>
          <a href="#" className={styles.actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{t.ctaPrimary}</span>
          </a>
          <a href="#" className={`${styles.actionBtn} ${styles.actionSecondary}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{t.ctaSecondary}</span>
          </a>
          <a href="https://ki.nutriteam.ch/?utm_source=nutriteam-network&utm_medium=hero&utm_campaign=ai-health" target="_blank" rel="noopener noreferrer" className={`${styles.actionBtn} ${styles.actionSecondary}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Health Assistant</span>
          </a>
        </div>

        {/* <div className={styles.stats}>
          <div>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Professionals</div>
          </div>
          <div>
            <div className={styles.statNumber}>12</div>
            <div className={styles.statLabel}>Specialties</div>
          </div>
          <div>
            <div className={styles.statNumber}>3</div>
            <div className={styles.statLabel}>Languages</div>
          </div>
        </div> */}
        </div>
      </section>
    </main>
  );
}
