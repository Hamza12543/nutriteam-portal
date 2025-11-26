"use client";
import styles from "./page.module.scss";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";

export default function AboutPage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    h1: string;
    sub: string;
    missionTitle: string;
    missionText: string;
    valuesTitle: string;
    v1: string; v1d: string;
    v2: string; v2d: string;
    v3: string; v3d: string;
    stats1: string; stats1d: string;
    stats2: string; stats2d: string;
    stats3: string; stats3d: string;
    teamTitle: string;
    ctaTitle: string;
    ctaBtn: string;
  }> = {
    en: {
      h1: "Empowering functional, preventative and holistic healthcare",
      sub: "OmniCheck Network connects patients and verified professionals to collaborate for better outcomes.",
      missionTitle: "Our mission",
      missionText: "We build a trusted, inclusive network that empowers people to find the right healthcare partners, access quality guidance, and manage their wellness journey with confidence.",
      valuesTitle: "Our values",
      v1: "Trust",
      v1d: "Verified profiles, transparent information, and privacy-first design.",
      v2: "Collaboration",
      v2d: "Patients and professionals working together with shared goals.",
      v3: "Accessibility",
      v3d: "Clear language, inclusive UX, and cross-border reach across Europe.",
      stats1: "Professionals",
      stats1d: "+1,200 verified",
      stats2: "Countries",
      stats2d: "25+ covered",
      stats3: "Resources",
      stats3d: "Hundreds of guides",
      teamTitle: "Team & partners",
      ctaTitle: "Join the network and shape better healthcare",
      ctaBtn: "Get started",
    },
    de: {
      h1: "Stärkung der funktionellen, präventiven und ganzheitlichen Gesundheit",
      sub: "OmniCheck Network verbindet Patient:innen und verifizierte Fachpersonen zur Zusammenarbeit für bessere Ergebnisse.",
      missionTitle: "Unsere Mission",
      missionText: "Wir bauen ein vertrauenswürdiges, inklusives Netzwerk, das Menschen befähigt, passende Gesundheitspartner zu finden, hochwertige Orientierung zu erhalten und ihren Weg selbstbewusst zu gestalten.",
      valuesTitle: "Unsere Werte",
      v1: "Vertrauen",
      v1d: "Verifizierte Profile, transparente Informationen und Datenschutz an erster Stelle.",
      v2: "Zusammenarbeit",
      v2d: "Patient:innen und Fachpersonen arbeiten mit gemeinsamen Zielen zusammen.",
      v3: "Zugänglichkeit",
      v3d: "Klar verständliche Sprache, inklusives UX und grenzüberschreitende Reichweite in Europa.",
      stats1: "Fachpersonen",
      stats1d: "+1.200 verifiziert",
      stats2: "Länder",
      stats2d: "25+ abgedeckt",
      stats3: "Ressourcen",
      stats3d: "Hunderte von Guides",
      teamTitle: "Team & Partner",
      ctaTitle: "Werden Sie Teil des Netzwerks und gestalten Sie bessere Gesundheit",
      ctaBtn: "Jetzt starten",
    },
    fr: {
      h1: "Renforcer une santé fonctionnelle, préventive et holistique",
      sub: "OmniCheck Network relie patients et professionnels vérifiés pour mieux collaborer.",
      missionTitle: "Notre mission",
      missionText: "Nous construisons un réseau de confiance et inclusif pour aider chacun à trouver les bons partenaires, accéder à des conseils de qualité et piloter son parcours en toute confiance.",
      valuesTitle: "Nos valeurs",
      v1: "Confiance",
      v1d: "Profils vérifiés, information transparente et protection des données.",
      v2: "Collaboration",
      v2d: "Patients et professionnels avancent ensemble vers des objectifs partagés.",
      v3: "Accessibilité",
      v3d: "Langage clair, UX inclusive et portée transfrontalière en Europe.",
      stats1: "Professionnels",
      stats1d: "+1 200 vérifiés",
      stats2: "Pays",
      stats2d: "25+ couverts",
      stats3: "Ressources",
      stats3d: "Des centaines de guides",
      teamTitle: "Équipe & partenaires",
      ctaTitle: "Rejoignez le réseau et faites évoluer la santé",
      ctaBtn: "Commencer",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className={styles.title}>{t.h1}</h1>
              <p className={styles.subtitle}>{t.sub}</p>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className={styles.heroArt} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mission}> 
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className={styles.cardPrimary}>
                <h3>{t.missionTitle}</h3>
                <p>{t.missionText}</p>
                <div className={styles.stats}>
                  <div className={styles.stat}><strong>1k+</strong><span>{t.stats1}</span><small>{t.stats1d}</small></div>
                  <div className={styles.stat}><strong>25+</strong><span>{t.stats2}</span><small>{t.stats2d}</small></div>
                  <div className={styles.stat}><strong>500+</strong><span>{t.stats3}</span><small>{t.stats3d}</small></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.values}>
                <h3>{t.valuesTitle}</h3>
                <div className="row g-3">
                  <div className="col-sm-4">
                    <div className={styles.valueItem}>
                      <div className={styles.icon} aria-hidden>🔒</div>
                      <h4>{t.v1}</h4>
                      <p>{t.v1d}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className={styles.valueItem}>
                      <div className={styles.icon} aria-hidden>🤝</div>
                      <h4>{t.v2}</h4>
                      <p>{t.v2d}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className={styles.valueItem}>
                      <div className={styles.icon} aria-hidden>🌍</div>
                      <h4>{t.v3}</h4>
                      <p>{t.v3d}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.team}> 
        <div className="container">
          <h3 className="mb-3">{t.teamTitle}</h3>
          <div className={styles.partnerStrip}>
            <div className={styles.partner} aria-hidden>NN</div>
            <div className={styles.partner} aria-hidden>💙</div>
            <div className={styles.partner} aria-hidden>🧬</div>
            <div className={styles.partner} aria-hidden>🧑‍⚕️</div>
            <div className={styles.partner} aria-hidden>🌱</div>
          </div>
        </div>
      </section>

      <section className={styles.cta}> 
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={styles.ctaCard}>
                <h3>{t.ctaTitle}</h3>
                <a style={{backgroundColor:"#0c6172",color:"white", border: "1px solid #0c6172"}} href="/register" className="btn btn-primary btn-lg">{t.ctaBtn}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
