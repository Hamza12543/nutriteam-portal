"use client";
import styles from "./Features.module.scss";
import { useLanguage } from "../providers/LanguageProvider";

export default function Features() {
  const { lang } = useLanguage();

  const copy: Record<string, {
    heading: string;
    sub: string;
    f1t: string; f1d: string;
    f2t: string; f2d: string;
    f3t: string; f3d: string;
    f4t: string; f4d: string;
    f5t: string; f5d: string;
    f6t: string; f6d: string;
  }> = {
    en: {
      heading: "Why Choose OmniCheck AI?",
      sub: "We make it easy to find and connect with trusted healthcare professionals in your area.",
      f1t: "Find Professionals", f1d: "Search our comprehensive directory of verified healthcare professionals across Europe.",
      f2t: "Location-Based Search", f2d: "Discover professionals near you with our interactive map and location filters.",
      f3t: "Verified Profiles", f3d: "All professionals are verified to ensure quality and trustworthiness.",
      f4t: "Easy Booking", f4d: "Book appointments directly through professional booking links.",
      f5t: "Multilingual Support", f5d: "Find professionals who speak your language (German, English, French).",
      f6t: "Join Our Network", f6d: "Healthcare professionals can register and connect with patients.",
    },
    de: {
      heading: "Warum OmniCheck AI?",
      sub: "Wir erleichtern es, vertrauenswürdige Gesundheitsfachpersonen in Ihrer Nähe zu finden und zu kontaktieren.",
      f1t: "Fachpersonen finden", f1d: "Durchsuchen Sie unser umfassendes Verzeichnis verifizierter Gesundheitsfachpersonen in Europa.",
      f2t: "Standortbasierte Suche", f2d: "Entdecken Sie Fachpersonen in Ihrer Nähe mit interaktiver Karte und Filter.",
      f3t: "Verifizierte Profile", f3d: "Alle Profile sind überprüft – für Qualität und Vertrauen.",
      f4t: "Einfache Buchung", f4d: "Vereinbaren Sie Termine direkt über die Buchungslinks der Fachpersonen.",
      f5t: "Mehrsprachige Unterstützung", f5d: "Finden Sie Fachpersonen, die Ihre Sprache sprechen (Deutsch, Englisch, Französisch).",
      f6t: "Unser Netzwerk beitreten", f6d: "Gesundheitsfachpersonen können sich registrieren und mit Patient:innen vernetzen.",
    },
    fr: {
      heading: "Pourquoi choisir OmniCheck AI ?",
      sub: "Nous facilitons la recherche et la mise en relation avec des professionnels de santé de confiance près de chez vous.",
      f1t: "Trouver des professionnels", f1d: "Explorez notre annuaire complet de professionnels de santé vérifiés en Europe.",
      f2t: "Recherche par localisation", f2d: "Découvrez des professionnels près de chez vous avec carte interactive et filtres.",
      f3t: "Profils vérifiés", f3d: "Tous les professionnels sont vérifiés pour garantir la qualité et la confiance.",
      f4t: "Réservation facile", f4d: "Prenez rendez-vous directement via les liens de réservation des professionnels.",
      f5t: "Support multilingue", f5d: "Trouvez des professionnels parlant votre langue (allemand, anglais, français).",
      f6t: "Rejoindre notre réseau", f6d: "Les professionnels de santé peuvent s'inscrire et se connecter avec les patients.",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <section className={`${styles.features} container`}>
      <div className={styles.featuresHeader}>
        <h2>{t.heading}</h2>
        <p>
          {t.sub}
        </p>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className={`card h-100 border ${styles.featureCard}`}>
            <div className="card-body">
              <div className={`mx-auto ${styles.featureIcon}`} aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className={styles.featureCardHeading}>{t.f1t}</h3>
              <p>{t.f1d}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className={`card h-100 border ${styles.featureCard}`}>
            <div className="card-body">
              <div className={`mx-auto ${styles.featureIcon}`} aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 2a9 9 0 1 0 9 9h0A9 9 0 0 0 12 2Z" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className={styles.featureCardHeading}>{t.f2t}</h3>
              <p>{t.f2d}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className={`card h-100 border ${styles.featureCard}`}>
            <div className="card-body">
              <div className={`mx-auto ${styles.featureIcon}`} aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className={styles.featureCardHeading}>{t.f3t}</h3>
              <p>{t.f3d}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className={`card h-100 border ${styles.featureCard}`}>
            <div className="card-body">
              <div className={`mx-auto ${styles.featureIcon}`} aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M6 8h12M6 12h12M6 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className={styles.featureCardHeading}>{t.f4t}</h3>
              <p>{t.f4d}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className={`card h-100 border ${styles.featureCard}`}>
            <div className="card-body">
              <div className={`mx-auto ${styles.featureIcon}`} aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M3 7c3 0 3-2 6-2s3 2 6 2 3-2 6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className={styles.featureCardHeading}>{t.f5t}</h3>
              <p>{t.f5d}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className={`card h-100 border ${styles.featureCard}`}>
            <div className="card-body">
              <div className={`mx-auto ${styles.featureIcon}`} aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 1 1-8 0" stroke="currentColor" strokeWidth="2"/><path d="M3 21a9 9 0 0 1 18 0" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <h3 className={styles.featureCardHeading}>{t.f6t}</h3>
              <p>{t.f6d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
